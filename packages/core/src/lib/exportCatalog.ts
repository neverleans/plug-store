import { Product } from '@/types';

const escapeCsv = (v: unknown): string => {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const productsToCsv = (products: Product[]): string => {
  const headers = ['id', 'name', 'category', 'price', 'originalPrice', 'rating', 'reviewCount', 'inStock', 'tags', 'description'];
  const rows = products.map((p) =>
    [
      p.id,
      p.name,
      p.category,
      p.price,
      p.originalPrice ?? '',
      p.rating,
      p.reviewCount,
      p.inStock ? 'yes' : 'no',
      p.tags.join('|'),
      p.description,
    ].map(escapeCsv).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

export const downloadBlob = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

export const downloadProductsCsv = (products: Product[], filename = 'catalog.csv') => {
  downloadBlob(productsToCsv(products), filename, 'text/csv;charset=utf-8');
};

/** Print-friendly HTML → user can Save as PDF from the print dialog. */
export const openCatalogPrintable = (products: Product[], title: string) => {
  const win = window.open('', '_blank');
  if (!win) return;
  const rows = products
    .map(
      (p) => `
        <tr>
          <td>${p.id}</td>
          <td><strong>${p.name}</strong><br/><small>${p.description}</small></td>
          <td>${p.category}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>${p.inStock ? 'In stock' : 'Out'}</td>
        </tr>`
    )
    .join('');
  win.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      body{font-family:system-ui,-apple-system,sans-serif;padding:32px;color:#111}
      h1{font-size:24px;margin:0 0 4px}
      p.sub{color:#666;margin:0 0 24px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border-bottom:1px solid #eee;padding:8px;text-align:left;vertical-align:top}
      th{background:#f7f7f7;text-transform:uppercase;font-size:10px;letter-spacing:0.06em}
      tr:nth-child(even) td{background:#fafafa}
      @media print{ body{padding:16px} button{display:none} }
    </style>
  </head><body>
    <h1>${title}</h1>
    <p class="sub">${products.length} products · Generated ${new Date().toLocaleDateString()}</p>
    <button onclick="window.print()" style="margin-bottom:16px;padding:8px 16px;cursor:pointer">🖨 Print / Save as PDF</button>
    <table>
      <thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`);
  win.document.close();
};

// ── CSV import ──────────────────────────────────────────
const parseCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
};

export const parseProductsCsv = (text: string, industry: string): Product[] => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = (k: string) => headers.indexOf(k);
  const iId = idx('id'), iName = idx('name'), iPrice = idx('price');
  const iCat = idx('category'), iDesc = idx('description');
  const iTags = idx('tags'), iRating = idx('rating'), iRev = idx('reviewcount');
  const iOrig = idx('originalprice'), iStock = idx('instock');

  return lines.slice(1).map((line, n): Product | null => {
    const cols = parseCsvLine(line);
    const name = (iName >= 0 ? cols[iName] : '').trim();
    if (!name) return null;
    const priceNum = parseFloat((iPrice >= 0 ? cols[iPrice] : '0').replace(/[^0-9.]/g, '')) || 0;
    return {
      id: (iId >= 0 && cols[iId] ? cols[iId] : `imp-${industry}-${Date.now()}-${n}`).trim(),
      name,
      description: (iDesc >= 0 ? cols[iDesc] : '').trim(),
      price: priceNum,
      originalPrice: iOrig >= 0 && cols[iOrig] ? parseFloat(cols[iOrig]) || undefined : undefined,
      images: [],
      category: (iCat >= 0 ? cols[iCat] : 'general').trim() || 'general',
      rating: iRating >= 0 && cols[iRating] ? parseFloat(cols[iRating]) || 4.5 : 4.5,
      reviewCount: iRev >= 0 && cols[iRev] ? parseInt(cols[iRev], 10) || 0 : 0,
      tags: iTags >= 0 && cols[iTags] ? cols[iTags].split('|').map((t) => t.trim()).filter(Boolean) : [],
      inStock: iStock >= 0 ? !/^(no|false|0|out)$/i.test(cols[iStock].trim()) : true,
      industry: industry as Product['industry'],
    };
  }).filter((p): p is Product => p !== null);
};
