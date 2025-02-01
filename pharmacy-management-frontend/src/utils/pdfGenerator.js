import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateSalesPDF = (salesData, invoiceNumber) => {
    setTimeout(() => {
      const input = document.getElementById("sales-invoice");
  
      if (!input) {
        console.error("❌ Invoice element not found. Make sure it exists before generating the PDF.");
        return;
      }
  
      html2canvas(input, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png"); // Convert to image
          const pdf = new jsPDF("p", "mm", "a4");
  
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
          pdf.save(`sales_invoice_${salesData.userId.firstName}.pdf`); // ✅ Include Invoice Number in file name
        })
        .catch((error) => {
          console.error("❌ Error generating PDF:", error);
        });
    }, 1000);
  };
  