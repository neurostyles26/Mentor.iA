import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// Use a very stable version for the worker from unpkg
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs'

export const documentProcessor = {
  async extractText(file) {
    const fileType = file.name.split('.').pop().toLowerCase()
    console.log(`Procesando archivo tipo: ${fileType}`)
    
    try {
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
    } catch (err) {
      console.error('Error en documentProcessor:', err)
      throw new Error(`Error al leer el archivo: ${err.message}`)
    }
  },

  async processPDF(file) {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false 
    })
    
    const pdf = await loadingTask.promise
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map(item => item.str)
      fullText += strings.join(' ') + '\n'
      console.log(`Página ${i} procesada`)
    }
    
    if (!fullText.trim()) throw new Error('El PDF parece estar vacío o ser una imagen (OCR no soportado)')
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
