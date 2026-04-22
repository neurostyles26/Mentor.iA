import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// Set worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export const documentProcessor = {
  async extractText(file) {
    const fileType = file.name.split('.').pop().toLowerCase()
    
    switch (fileType) {
      case 'pdf':
        return await this.processPDF(file)
      case 'docx':
        return await this.processDOCX(file)
      case 'xlsx':
      case 'xls':
        return await this.processXLSX(file)
      default:
        throw new Error('Formato de archivo no soportado')
    }
  },

  async processPDF(file) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map(item => item.str)
      fullText += strings.join(' ') + '\n'
    }
    
    return fullText
  },

  async processDOCX(file) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  },

  async processXLSX(file) {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    let fullText = ''
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      fullText += `Hoja: ${sheetName}\n`
      jsonData.forEach(row => {
        fullText += row.join('\t') + '\n'
      })
    })
    
    return fullText
  }
}
