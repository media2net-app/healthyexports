const PptxGenJS = require('pptxgenjs')

function generateDemoPPT() {
  const pptx = new PptxGenJS()

  // Slide 1: Company Overview
  const slide1 = pptx.addSlide()
  slide1.addText('Healthy Medical Solutions', {
    x: 0.5,
    y: 1,
    w: 9,
    h: 1,
    fontSize: 44,
    bold: true,
    color: '1F7A8C',
    align: 'center'
  })
  slide1.addText('Bedrijfsprofiel', {
    x: 0.5,
    y: 2,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: '666666',
    align: 'center'
  })
  slide1.addText('Gespecialiseerd in medische apparatuur en health producten', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: '333333',
    align: 'center'
  })

  // Slide 2: Products
  const slide2 = pptx.addSlide()
  slide2.addText('Onze Producten', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide2.addText('• Diagnostische apparatuur', {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• Therapeutische apparaten', {
    x: 0.5,
    y: 2.4,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• Consumables en disposables', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• Software oplossingen voor gezondheidszorg', {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })

  // Slide 3: Certifications
  const slide3 = pptx.addSlide()
  slide3.addText('Certificeringen & Kwaliteit', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide3.addText('CE Markering', {
    x: 0.5,
    y: 1.8,
    w: 4,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '2E7D32'
  })
  slide3.addText('ISO 13485:2016', {
    x: 5.5,
    y: 1.8,
    w: 4,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '2E7D32'
  })
  slide3.addText('FDA Approved', {
    x: 0.5,
    y: 2.8,
    w: 4,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '2E7D32'
  })
  slide3.addText('MDR Compliant', {
    x: 5.5,
    y: 2.8,
    w: 4,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '2E7D32'
  })

  // Slide 4: Target Markets
  const slide4 = pptx.addSlide()
  slide4.addText('Doelmarkten', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide4.addText('Europa', {
    x: 0.5,
    y: 1.8,
    w: 4,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide4.addText('• Nederland, België, Duitsland', {
    x: 1,
    y: 2.3,
    w: 8,
    h: 0.4,
    fontSize: 16,
    bullet: true
  })
  slide4.addText('• Frankrijk, Verenigd Koninkrijk', {
    x: 1,
    y: 2.7,
    w: 8,
    h: 0.4,
    fontSize: 16,
    bullet: true
  })
  slide4.addText('Noord-Amerika', {
    x: 0.5,
    y: 3.5,
    w: 4,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide4.addText('• Verenigde Staten, Canada', {
    x: 1,
    y: 4,
    w: 8,
    h: 0.4,
    fontSize: 16,
    bullet: true
  })

  // Slide 5: Key Features
  const slide5 = pptx.addSlide()
  slide5.addText('Belangrijkste Kenmerken', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide5.addText('✓ Innovatieve technologie', {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 0.5,
    fontSize: 20
  })
  slide5.addText('✓ Breed productassortiment', {
    x: 0.5,
    y: 2.4,
    w: 9,
    h: 0.5,
    fontSize: 20
  })
  slide5.addText('✓ Sterke marktpositie', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 20
  })
  slide5.addText('✓ Betrouwbare kwaliteit', {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.5,
    fontSize: 20
  })
  slide5.addText('✓ Uitstekende klantenservice', {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 0.5,
    fontSize: 20
  })

  // Save the file
  pptx.writeFile({ fileName: 'demo-company-profile.pptx' })
    .then(() => {
      console.log('✅ Demo PPTX bestand succesvol gegenereerd: demo-company-profile.pptx')
      console.log('📁 Bestand staat in de root directory van het project')
    })
    .catch((err) => {
      console.error('❌ Fout bij het genereren van het bestand:', err)
    })
}

generateDemoPPT()






