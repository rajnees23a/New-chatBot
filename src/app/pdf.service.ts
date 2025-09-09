import jsPDF from 'jspdf';
 
export class PdfService {
  generateTicketPdf(ticketData: any): Blob {
    const doc = new jsPDF();
 
    doc.setFontSize(16);
    doc.text('Ticket Details', 10, 10);
    
    doc.setFontSize(12);
doc.text(`Ticket ID: ${ticketData.id}`, 10, 20);
doc.text(`Name: ${ticketData.name}`, 10, 30);
doc.text(`Email: ${ticketData.email}`, 10, 40);
    doc.text(`Subject: ${ticketData.subject}`, 10, 50);
    doc.text(`Description: ${ticketData.description}`, 10, 60);
    doc.text(`Created On: ${ticketData.createdOn}`, 10, 70);
    
    // Convert to Blob for EmailJS
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  }
}