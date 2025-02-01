const SalesPDF = ({ salesData, invoiceNumber }) => {
  const { userId, date, medicines, totalPrice } = salesData;
  const userName = `${userId?.firstName || ""} ${userId?.lastName || ""}`;
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <div>
      <div
        id="sales-invoice"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "800px",
          backgroundColor: "#fff",
          padding: "20px",
          border: "1px solid black",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
        }}
      >
        {/* Header */}
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>SHREE GEL FAMILY MALL</h2>
        <p style={{ textAlign: "center", margin: "0" }}>
          C-1, Shaurashta Soc-2, Nr. G.G Zadafiya School, A.K Road, Hirabag, Surat - 395008
        </p>
        <p style={{ textAlign: "center", margin: "0" }}>Mobile: 99249 89218</p>

        {/* Invoice Details */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", borderBottom: "1px solid black", paddingBottom: "10px" }}>
          <p><strong>Customer:</strong> {userName}</p>
          <div style={{ border: "1px solid black", padding: "5px", textAlign: "center" }}>
            <p style={{ margin: "0" }}><strong>Invoice #:</strong> {invoiceNumber}</p> {/* ✅ Correct Invoice Number */}
            <p style={{ margin: "0" }}><strong>Date:</strong> {formattedDate}</p>
          </div>
        </div>

        {/* Medicine Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }} border="1">
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0", textAlign: "center" }}>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                <td>{index + 1}</td>
                <td>{med.medicineId?.name}</td>
                <td>{med.Quantity}</td>
                <td>₹{med.price.toFixed(2)}</td> {/* ✅ INR Symbol */}
                <td>₹{(med.Quantity * med.price).toFixed(2)}</td> {/* ✅ INR Symbol */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Price */}
        <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold" }}>
          Total Price: ₹{totalPrice.toFixed(2)} {/* ✅ INR Symbol */}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "10px", borderTop: "1px solid black" }}>
          <p>Thank you for visiting! Have a nice day!</p>
          <p>Visit Again</p>
        </div>
      </div>
    </div>
  );
};

export default SalesPDF;
