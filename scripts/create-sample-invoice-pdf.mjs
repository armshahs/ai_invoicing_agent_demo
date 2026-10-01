import { mkdirSync, writeFileSync } from 'node:fs'

const lines=['NORTHSTAR INDUSTRIAL','Invoice INV-NS-8841','Invoice date: 01 Oct 2026','PO number: PO-24119','','Manufacturing supplies                         $17,850.00','GST                                                     $892.50','Freight                                                $210.00','','Total amount                                  $18,742.50']
const stream=['BT','/F1 18 Tf','50 760 Td','(NORTHSTAR INDUSTRIAL) Tj','0 -32 Td','/F1 12 Tf',...lines.slice(1).flatMap(line=>[`(${line.replace(/[()\\]/g,'\\$&')}) Tj`,'0 -22 Td']),'ET'].join('\n')
const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']
let pdf='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
const offsets=[0]
objects.forEach((object,index)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${index+1} 0 obj\n${object}\nendobj\n`})
const xref=Buffer.byteLength(pdf)
pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(offset=>`${String(offset).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
mkdirSync(new URL('../public/invoices/',import.meta.url),{recursive:true})
writeFileSync(new URL('../public/invoices/INV-NS-8841.pdf',import.meta.url),pdf,'binary')
