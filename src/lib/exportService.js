import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import pptxgen from 'pptxgenjs'

class ExportService {
  /**
   * Cleans markdown symbols from text for professional documents
   */
  cleanMarkdown(text) {
    if (!text) return ''
    return text
      .replace(/#{1,6}\s?/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italics
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/`{1,3}(.*?)`{1,3}/gs, '$1') // Remove code blocks
      .replace(/^\s*[-*+]\s+/gm, '• ') // Convert bullet points to dots
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list prefixes
      .replace(/---/g, '') // Remove horizontal lines
      .replace(/&nbsp;/g, ' ')
      .replace(/[^\x00-\x7F]/g, (char) => {
        // Fallback for some common special chars that jsPDF might fail on
        const map = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N' }
        return map[char] || '' 
      }) // Clean non-ASCII for basic PDF fonts resilience
      .trim()
  }

  /**
   * Export items to a PDF document with professional layout
   */
  exportToPDF(items, fileName = `MentorIA_lesson_${new Date().toISOString().split('T')[0]}.pdf`) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    const addHeader = (doc) => {
      // Premium Top Bar
      doc.setFillColor(63, 63, 191) // Indigo Primary
      doc.rect(0, 0, pageWidth, 15, 'F')
      
      doc.setTextColor(255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('INTELIGENCIA ARTIFICIAL APLICADA A LA EDUCACIÓN', 20, 10)
      
      // Secondary Header
      doc.setTextColor(63, 63, 191)
      doc.setFontSize(24)
      doc.text('MentorIA', 20, 30)
      
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text('REPORTE DE CONTENIDO PEDAGÓGICO', 20, 36)
      
      doc.setDrawColor(230)
      doc.line(20, 40, pageWidth - 20, 40)
    }

    const addFooter = (doc, pageNum) => {
      doc.setDrawColor(230)
      doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20)
      
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(`Generado por MentorIA - Tu asistente pedagógico inteligente`, 20, pageHeight - 15)
      doc.text(`Página ${pageNum}`, pageWidth - 35, pageHeight - 15)
    }

    addHeader(doc)
    let yPos = 55
    let currentPage = 1

    items.forEach((item, index) => {
      const cleanContent = this.cleanMarkdown(item.content)
      const splitText = doc.splitTextToSize(cleanContent, pageWidth - 40)
      const itemHeight = (splitText.length * 6) + 20

      // Check for new page
      if (yPos + itemHeight > pageHeight - 30) {
        addFooter(doc, currentPage)
        doc.addPage()
        currentPage++
        addHeader(doc)
        yPos = 55
      }

      // Title/Tag
      doc.setFillColor(245, 247, 255)
      doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F')
      
      doc.setFontSize(12)
      doc.setTextColor(30)
      doc.setFont('helvetica', 'bold')
      doc.text(`${item.tag || 'Contenido'}`.toUpperCase(), 25, yPos + 1)
      
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(new Date(item.created_at).toLocaleDateString(), pageWidth - 40, yPos + 1)
      
      yPos += 12

      // Content
      doc.setFontSize(10)
      doc.setTextColor(60)
      doc.setFont('helvetica', 'normal')
      doc.text(splitText, 20, yPos)
      
      yPos += (splitText.length * 6) + 15
    })

    addFooter(doc, currentPage)
    doc.save(fileName)
  }

  exportToExcel(items, fileName = 'MentorIA_Export.xlsx') {
    const data = items.map(item => ({
      Fecha: new Date(item.created_at).toLocaleDateString(),
      Etiqueta: item.tag || 'Clase',
      Contenido: this.cleanMarkdown(item.content).substring(0, 32000) // Excel cell limit
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exportación')
    
    // Formatting headers
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1'
      if (!worksheet[address]) continue
      worksheet[address].s = { font: { bold: true }, fill: { fgColor: { rgb: "EFEFEF" } } }
    }

    worksheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 80 }]
    XLSX.writeFile(workbook, fileName)
  }

  exportToSlides(items, fileName = 'MentorIA_Presentacion.pptx') {
    const pres = new pptxgen()
    pres.layout = 'LAYOUT_16x9'
    
    items.forEach((item) => {
      const cleanContent = this.cleanMarkdown(item.content)
      const slide = pres.addSlide()
      
      // Gradient header substitute
      slide.addShape(pres.ShapeType.rect, { x: 0, y: 0.2, w: '100%', h: 0.6, fill: { color: '3F3FBF' } })
      
      slide.addText(item.tag || 'Contenido de Clase', {
        x: 0.4, y: 0.2, w: '90%', h: 0.6,
        fontSize: 22, color: 'FFFFFF', bold: true, valign: 'middle'
      })

      // Main Text Body
      slide.addText(cleanContent, {
        x: 0.5, y: 1.2, w: '90%', h: 4,
        fontSize: 14, color: '334155',
        valign: 'top',
        autoFit: true
      })
      
      slide.addText('Generado por MentorIA', {
        x: '75%', y: '92%', w: '20%', h: 0.3,
        fontSize: 10, color: '94A3B8', align: 'right'
      })
    })

    pres.writeFile({ fileName })
  }
}

export const exportService = new ExportService()
