import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import pptxgen from 'pptxgenjs'

class ExportService {
  /**
   * Export items to a PDF document
   * @param {Array} items - Array of clipboard items [{ content, title, tag, created_at }]
   * @param {String} fileName - Name of the file
   */
  exportToPDF(items, fileName = 'MentorIA_Export.pdf') {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(63, 63, 191) // A nice indigo
    doc.text('MentorIA - Exportación de Contenido', 20, 20)
    
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Fecha de exportación: ${new Date().toLocaleString()}`, 20, 28)
    doc.setDrawColor(200)
    doc.line(20, 32, pageWidth - 20, 32)

    let yPos = 45

    items.forEach((item, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Item Title/Tag
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}. ${item.tag || 'Sin etiqueta'}`, 20, yPos)
      
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text(new Date(item.created_at).toLocaleDateString(), pageWidth - 45, yPos)
      
      yPos += 8

      // Item Content
      doc.setFontSize(11)
      doc.setTextColor(50)
      doc.setFont('helvetica', 'normal')
      
      const splitText = doc.splitTextToSize(item.content, pageWidth - 40)
      doc.text(splitText, 20, yPos)
      
      yPos += (splitText.length * 6) + 10
      
      // Separator line
      doc.setDrawColor(240)
      doc.line(20, yPos - 5, pageWidth - 20, yPos - 5)
      yPos += 5
    })

    doc.save(fileName)
  }

  /**
   * Export items to an Excel (XLSX) file
   * @param {Array} items 
   * @param {String} fileName 
   */
  exportToExcel(items, fileName = 'MentorIA_Export.xlsx') {
    const data = items.map(item => ({
      Fecha: new Date(item.created_at).toLocaleDateString(),
      Etiqueta: item.tag || 'Clase',
      Contenido: item.content
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exportación')
    
    // Auto-size columns
    const maxWidths = [15, 15, 100]
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }))

    XLSX.writeFile(workbook, fileName)
  }

  /**
   * Export items to a Powerpoint (PPTX) presentation
   * @param {Array} items 
   * @param {String} fileName 
   */
  exportToSlides(items, fileName = 'MentorIA_Presentacion.pptx') {
    const pres = new pptxgen()
    
    // Welcome Slide
    let welcomeSlide = pres.addSlide()
    welcomeSlide.background = { color: 'F1F5F9' }
    welcomeSlide.addText('Generado por MentorIA', {
      x: 1, y: 1, w: '80%', h: 1,
      fontSize: 36, color: '3B82F6', bold: true, align: 'center'
    })
    welcomeSlide.addText(`Exportación del Portapapeles\n${new Date().toLocaleDateString()}`, {
      x: 1, y: 2.5, w: '80%', h: 1,
      fontSize: 18, color: '64748B', align: 'center'
    })

    // Content Slides
    items.forEach((item) => {
      let slide = pres.addSlide()
      
      // Header for slide
      slide.addText(item.tag || 'Contenido de Clase', {
        x: 0.5, y: 0.5, w: '90%', h: 0.5,
        fontSize: 24, color: '1E293B', bold: true,
        fill: { color: 'F8FAFC' }
      })

      // Main Content
      slide.addText(item.content, {
        x: 0.5, y: 1.2, w: '90%', h: 4,
        fontSize: 14, color: '334155',
        valign: 'top',
        bullet: item.content.includes('\n-') || item.content.includes('\n*')
      })
      
      // Footer
      slide.addText('MentorIA - Tu Mentor Educativo', {
        x: 0.5, y: 5.2, w: '90%', h: 0.3,
        fontSize: 10, color: '94A3B8', align: 'right'
      })
    })

    pres.writeFile({ fileName })
  }
}

export const exportService = new ExportService()
