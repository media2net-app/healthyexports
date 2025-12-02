const PptxGenJS = require('pptxgenjs')

function generateDemoProductPPT() {
  const pptx = new PptxGenJS()

  // Slide 1: Product Overview
  const slide1 = pptx.addSlide()
  slide1.addText('MediScan Pro', {
    x: 0.5,
    y: 1,
    w: 9,
    h: 1,
    fontSize: 44,
    bold: true,
    color: '1F7A8C',
    align: 'center'
  })
  slide1.addText('Diagnostisch Medisch Apparaat', {
    x: 0.5,
    y: 2,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: '666666',
    align: 'center'
  })
  slide1.addText('Geavanceerde medische beeldvorming voor professionals', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: '333333',
    align: 'center'
  })

  // Slide 2: Product Features
  const slide2 = pptx.addSlide()
  slide2.addText('Product Kenmerken', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide2.addText('• Hoge resolutie beeldkwaliteit', {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• Draagbaar en gebruiksvriendelijk', {
    x: 0.5,
    y: 2.4,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• Cloud connectiviteit voor data opslag', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• AI-ondersteunde diagnose', {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })
  slide2.addText('• Multi-linguaal interface', {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true
  })

  // Slide 3: Technical Specifications
  const slide3 = pptx.addSlide()
  slide3.addText('Technische Specificaties', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide3.addText('Afmetingen: 30 x 25 x 15 cm', {
    x: 0.5,
    y: 1.8,
    w: 4.5,
    h: 0.5,
    fontSize: 18
  })
  slide3.addText('Gewicht: 3.5 kg', {
    x: 5.5,
    y: 1.8,
    w: 4.5,
    h: 0.5,
    fontSize: 18
  })
  slide3.addText('Resolutie: 1920 x 1080 pixels', {
    x: 0.5,
    y: 2.5,
    w: 4.5,
    h: 0.5,
    fontSize: 18
  })
  slide3.addText('Batterij: 8 uur werkend', {
    x: 5.5,
    y: 2.5,
    w: 4.5,
    h: 0.5,
    fontSize: 18
  })
  slide3.addText('Connectiviteit: WiFi, Bluetooth, USB-C', {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.5,
    fontSize: 18
  })

  // Slide 4: Applications
  const slide4 = pptx.addSlide()
  slide4.addText('Toepassingen', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide4.addText('Ziekenhuizen', {
    x: 0.5,
    y: 1.8,
    w: 4,
    h: 0.6,
    fontSize: 20,
    bullet: true
  })
  slide4.addText('Klinieken', {
    x: 5,
    y: 1.8,
    w: 4.5,
    h: 0.6,
    fontSize: 20,
    bullet: true
  })
  slide4.addText('Huisartsenpraktijken', {
    x: 0.5,
    y: 2.6,
    w: 4,
    h: 0.6,
    fontSize: 20,
    bullet: true
  })
  slide4.addText('Ambulante zorg', {
    x: 5,
    y: 2.6,
    w: 4.5,
    h: 0.6,
    fontSize: 20,
    bullet: true
  })
  slide4.addText('Onderzoeksinstellingen', {
    x: 0.5,
    y: 3.4,
    w: 9,
    h: 0.6,
    fontSize: 20,
    bullet: true
  })

  // Slide 5: Certifications & Compliance
  const slide5 = pptx.addSlide()
  slide5.addText('Certificeringen', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F7A8C'
  })
  slide5.addText('CE Markering (Class IIa)', {
    x: 0.5,
    y: 1.8,
    w: 4,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: '2E7D32'
  })
  slide5.addText('ISO 13485:2016', {
    x: 5.5,
    y: 1.8,
    w: 4,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: '2E7D32'
  })
  slide5.addText('FDA 510(k) Cleared', {
    x: 0.5,
    y: 2.8,
    w: 4,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: '2E7D32'
  })
  slide5.addText('MDR Compliant', {
    x: 5.5,
    y: 2.8,
    w: 4,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: '2E7D32'
  })

  // Save the file
  pptx.writeFile({ fileName: 'demo-product-profile.pptx' })
    .then(() => {
      console.log('✅ Demo Product PPTX bestand succesvol gegenereerd: demo-product-profile.pptx')
      console.log('📁 Bestand staat in de root directory van het project')
    })
    .catch((err) => {
      console.error('❌ Fout bij het genereren van het bestand:', err)
    })
}

generateDemoProductPPT()






