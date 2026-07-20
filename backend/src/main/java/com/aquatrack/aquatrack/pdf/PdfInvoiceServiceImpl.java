package com.aquatrack.aquatrack.pdf;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.entity.Invoice;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.InvoiceRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfInvoiceServiceImpl implements PdfInvoiceService {

    private final InvoiceRepository invoiceRepository;

    public PdfInvoiceServiceImpl(
            InvoiceRepository invoiceRepository) {

        this.invoiceRepository = invoiceRepository;
    }

    @Override
    public byte[] generateInvoice(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        try {

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            Document document = new Document(
                                PageSize.A4,
                                45,
                                45,
                                45,
                                45);

            PdfWriter.getInstance(document, output);

            document.open();

            Font title =
        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);

        Font heading =
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13);

        Font normal =
                FontFactory.getFont(FontFactory.HELVETICA, 11);

        Font total =
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15);

        Paragraph titleParagraph = new Paragraph(
                "AquaTrack",
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        24));

        titleParagraph.setAlignment(Element.ALIGN_CENTER);

        document.add(titleParagraph);

        Paragraph subtitle = new Paragraph(
                "Water Billing Management System",
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        12));

        subtitle.setAlignment(Element.ALIGN_CENTER);

        document.add(subtitle);

        Paragraph invoiceTitle = new Paragraph(
                "WATER BILL INVOICE",
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        16));

        invoiceTitle.setAlignment(Element.ALIGN_CENTER);
        invoiceTitle.setSpacingBefore(15);
        invoiceTitle.setSpacingAfter(20);

        document.add(invoiceTitle);

        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingAfter(20);
        infoTable.setWidths(new float[]{1,1});

        PdfPCell left = new PdfPCell();
        left.setBorder(Rectangle.NO_BORDER);

        left.addElement(new Paragraph(
                "Issued By",
                heading));

        left.addElement(new Paragraph(
                "AquaTrack\nWater Billing Management System\nSupport: aquatrack.platform@gmail.com",
                normal));

        PdfPCell right = new PdfPCell();
        right.setBorder(Rectangle.NO_BORDER);

        Paragraph invoiceInfo = new Paragraph();
        invoiceInfo.add(new Paragraph(
                "Invoice No: " + invoice.getInvoiceNumber(),
                heading));

        invoiceInfo.add(new Paragraph(
                "Invoice ID: #" + invoice.getId(),
                normal));

        invoiceInfo.add(new Paragraph(
                "Issued On: " +
                        invoice.getGeneratedDate()
                                .format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                normal));

        right.addElement(invoiceInfo);

        infoTable.addCell(left);
        infoTable.addCell(right);

        document.add(infoTable);

        Paragraph billTo = new Paragraph(
                "Bill To",
                FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                14,
                new Color(33,150,243))
        );

        billTo.setSpacingAfter(10);

        document.add(billTo);

        PdfPTable customer = new PdfPTable(2);

        customer.setWidthPercentage(100);
        customer.setSpacingAfter(20);
        customer.setWidths(new float[]{2, 4});

        PdfPCell cell;

        // Apartment
        cell = new PdfPCell(new Paragraph("Apartment", heading));
        cell.setBorder(Rectangle.NO_BORDER);
        customer.addCell(cell);

        cell = new PdfPCell(new Paragraph(
                invoice.getHousehold().getApartment().getName()));
        cell.setBorder(Rectangle.NO_BORDER);
        customer.addCell(cell);

        // Flat
        cell = new PdfPCell(new Paragraph("Flat", heading));
        cell.setBorder(Rectangle.NO_BORDER);
        customer.addCell(cell);

        cell = new PdfPCell(new Paragraph(
                invoice.getHousehold().getFlatNumber()));
        cell.setBorder(Rectangle.NO_BORDER);
        customer.addCell(cell);

        // Billing Period
        cell = new PdfPCell(new Paragraph("Billing Period", heading));
        cell.setBorder(Rectangle.NO_BORDER);
        customer.addCell(cell);

        cell = new PdfPCell(new Paragraph(
                invoice.getBillingCycle()
                        .getStartDate()
                        .format(DateTimeFormatter.ofPattern("MMMM yyyy")), heading));
        cell.setBorder(Rectangle.NO_BORDER);
        customer.addCell(cell);

        document.add(customer);

        PdfPTable charges = new PdfPTable(2);

        charges.setWidthPercentage(100);
        charges.setWidths(new float[]{4, 2});
        charges.setSpacingAfter(20);

        // ---------- Header ----------

        PdfPCell header1 = new PdfPCell(new Paragraph("Charge Description", heading));
        header1.setBackgroundColor(Color.LIGHT_GRAY);
        header1.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell header2 = new PdfPCell(new Paragraph("Amount", heading));
        header2.setBackgroundColor(Color.LIGHT_GRAY);
        header2.setHorizontalAlignment(Element.ALIGN_CENTER);

        charges.addCell(header1);
        charges.addCell(header2);

        // ---------- Consumption ----------

        charges.addCell("Consumption");

        PdfPCell amountCell = new PdfPCell(
                new Paragraph(
                        String.format("%.2f KL", invoice.getConsumptionKl())));
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        charges.addCell(amountCell);

        // ---------- Purchased Water Rate ----------

        charges.addCell("Purchased Water Rate");

        amountCell = new PdfPCell(
                new Paragraph(
                        String.format("₹ %.2f / KL",
                                invoice.getPurchasedRate()), normal));

        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        charges.addCell(amountCell);

        // ---------- Usage Charge ----------

        charges.addCell("Usage Charge");

        amountCell = new PdfPCell(
                new Paragraph(
                        String.format("₹ %.2f", invoice.getUsageCharge()), normal));
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        charges.addCell(amountCell);

        // ---------- Fixed Charge ----------

        charges.addCell("Fixed Charge");

        amountCell = new PdfPCell(
                new Paragraph(
                        String.format("₹ %.2f", invoice.getFixedCharge()), normal));
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        charges.addCell(amountCell);

        // ---------- Bulk Water Share ----------

        charges.addCell("Bulk Water Share");

        amountCell = new PdfPCell(
                new Paragraph(
                        String.format("₹ %.2f", invoice.getDistributedCost()), normal));
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        charges.addCell(amountCell);

        // ---------- Shared Area ----------

        charges.addCell("Shared Area Charge");

        amountCell = new PdfPCell(
                new Paragraph(
                        String.format("₹ %.2f", invoice.getSharedAreaCharge()), normal));
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        charges.addCell(amountCell);

        PdfPCell empty1 = new PdfPCell(new Paragraph(""));
        empty1.setBorder(Rectangle.NO_BORDER);

        PdfPCell empty2 = new PdfPCell(new Paragraph(""));
        empty2.setBorder(Rectangle.NO_BORDER);

        charges.addCell(empty1);
        charges.addCell(empty2);

        // ---------- TOTAL ----------

        PdfPCell totalTitle =
                new PdfPCell(new Paragraph("AMOUNT PAYABLE", total));

        totalTitle.setBackgroundColor(new Color(220,220,220));
        totalTitle.setVerticalAlignment(Element.ALIGN_MIDDLE);

        charges.addCell(totalTitle);

        PdfPCell totalAmount =
                new PdfPCell(
                        new Paragraph(
                                String.format("₹ %.2f",
                                        invoice.getTotalAmount()),
                                total));

        totalAmount.setBackgroundColor(new Color(220,220,220));
        totalAmount.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalAmount.setVerticalAlignment(Element.ALIGN_MIDDLE);

        charges.addCell(totalAmount);

        document.add(charges);

        document.add(new Paragraph(" "));

        PdfPTable statusTable = new PdfPTable(1);

        statusTable.setWidthPercentage(35);
        statusTable.setHorizontalAlignment(Element.ALIGN_LEFT);

        Color textColor =
                invoice.getStatus().name().equals("GENERATED")
                        ? Color.BLACK
                        : Color.WHITE;

        PdfPCell statusCell = new PdfPCell(
                new Paragraph(
                        "PAYMENT STATUS\n\n" + invoice.getStatus(),
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                13,
                                textColor)));

        statusCell.setPadding(10);
        statusCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        switch (invoice.getStatus()) {

        case PAID ->
                statusCell.setBackgroundColor(new Color(76, 175, 80));

        case GENERATED ->
                statusCell.setBackgroundColor(new Color(255, 193, 7));

        case OVERDUE ->
                statusCell.setBackgroundColor(new Color(244, 67, 54));

        case CANCELLED ->
                statusCell.setBackgroundColor(Color.GRAY);

        default ->
                statusCell.setBackgroundColor(Color.LIGHT_GRAY);
        }

        statusTable.addCell(statusCell);

        document.add(statusTable);

        document.add(new Paragraph(" "));

        Paragraph generated = new Paragraph(
                "Generated On : "
                        + invoice.getGeneratedDate()
                                .format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                normal);

        generated.setSpacingAfter(10);

        document.add(generated);

        Paragraph line = new Paragraph(
        "────────────────────────────────────────────────────────");

        line.setAlignment(Element.ALIGN_CENTER);

        document.add(line);

        document.add(new Paragraph(" "));

        Paragraph footer = new Paragraph(

                "Generated by AquaTrack\n"
                        + "Water Billing Management System\n\n"
                        + "This is a computer-generated invoice.\n"
                        + "No signature is required.\n\n"
                        + "Support\n"
                        + "aquatrack.platform@gmail.com\n\n"
                        + "© 2026 AquaTrack",

                normal);

        // footer.setAlignment(Element.ALIGN_CENTER);

        document.add(footer);

            document.close();

            return output.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate PDF", e);
        }
    }
}