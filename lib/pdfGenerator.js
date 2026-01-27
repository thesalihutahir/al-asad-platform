import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateTransactionReport = (transactions, period = "All Time", type = "Transaction Report") => {
    const doc = new jsPDF();

    // --- BRANDING & HEADER ---
    // Header Background
    doc.setFillColor(66, 33, 11); // Brand Brown Dark (approx #42210B)
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Al-Asad Education Foundation", 14, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(type, 14, 30);

    // Date/Period
    doc.setFontSize(10);
    doc.text(`Period: ${period}`, 196, 30, { align: "right" });

    // --- SUMMARY STATS ---
    const totalAmount = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const successCount = transactions.filter(t => t.status === 'Success').length;
    const pendingCount = transactions.filter(t => t.status === 'Pending').length;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text(`Total Volume: NGN ${totalAmount.toLocaleString()}`, 14, 50);
    doc.text(`Successful: ${successCount}  |  Pending: ${pendingCount}`, 14, 56);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 196, 50, { align: "right" });

    // --- TABLE GENERATION ---
    const tableColumn = ["Date", "Reference", "Donor", "Fund", "Method", "Status", "Amount (NGN)"];
    const tableRows = [];

    transactions.forEach(ticket => {
        const transactionDate = ticket.createdAt?.seconds 
            ? new Date(ticket.createdAt.seconds * 1000).toLocaleDateString() 
            : 'N/A';

        const transactionData = [
            transactionDate,
            ticket.reference || "-",
            ticket.donorName || "Anonymous",
            ticket.fundTitle || "General",
            ticket.method || "-",
            ticket.status || "-",
            Number(ticket.amount).toLocaleString(),
        ];
        tableRows.push(transactionData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'grid',
        headStyles: { fillColor: [66, 33, 11], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    // --- FOOTER ---
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Confidential System Report - Generated from Admin Console', 105, 290, { align: 'center' });
    }

    // Save File
    doc.save(`AlAsad_${type.replace(" ", "_")}_${Date.now()}.pdf`);
};

export const generateReceipt = (transaction) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Branding
    doc.setFillColor(66, 33, 11);
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Title
    doc.setTextColor(66, 33, 11);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Donation Receipt", 105, 25, { align: "center" });

    // Reference Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Reference: ${transaction.reference}`, 105, 32, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 37, { align: "center" });

    // Amount Box
    doc.setDrawColor(200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(65, 45, 80, 25, 3, 3, 'FD');
    
    doc.setFontSize(16);
    doc.setTextColor(66, 33, 11);
    doc.setFont("helvetica", "bold");
    doc.text(`NGN ${Number(transaction.amount).toLocaleString()}`, 105, 60, { align: "center" });

    // Details List
    let yPos = 90;
    const details = [
        { label: "Donor Name", value: transaction.donorName || "Anonymous" },
        { label: "Fund", value: transaction.fundTitle || "General" },
        { label: "Payment Method", value: transaction.method },
        { label: "Status", value: transaction.status },
    ];

    details.forEach(detail => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(detail.label, 65, yPos);
        
        doc.setTextColor(0);
        doc.text(detail.value, 145, yPos, { align: "right" });
        
        doc.setDrawColor(240);
        doc.line(65, yPos + 3, 145, yPos + 3);
        yPos += 12;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for your generous support.", 105, 160, { align: "center" });

    doc.save(`Receipt_${transaction.reference}.pdf`);
};
