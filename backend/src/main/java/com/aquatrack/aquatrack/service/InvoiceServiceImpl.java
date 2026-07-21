package com.aquatrack.aquatrack.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aquatrack.aquatrack.billing.BillingEngineService;
import com.aquatrack.aquatrack.billing.BillingSummary;
import com.aquatrack.aquatrack.billing.HouseholdBill;
import com.aquatrack.aquatrack.billing.InvoiceGenerator;
import com.aquatrack.aquatrack.dto.BulkInvoiceEmailResponse;
import com.aquatrack.aquatrack.dto.FailedInvoiceResponse;
import com.aquatrack.aquatrack.dto.InvoiceResponse;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.BulkWaterPurchase;
import com.aquatrack.aquatrack.entity.Household;
import com.aquatrack.aquatrack.entity.Invoice;
import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.entity.WaterUsageLog;
import com.aquatrack.aquatrack.enums.BillingCycleStatus;
import com.aquatrack.aquatrack.enums.InvoiceStatus;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.pdf.PdfInvoiceService;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.BulkWaterPurchaseRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.InvoiceRepository;
import com.aquatrack.aquatrack.repository.MeterRepository;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final HouseholdRepository householdRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;
    private final BulkWaterPurchaseRepository bulkWaterPurchaseRepository;
    private final MeterRepository meterRepository;

    private final BillingEngineService billingEngineService;
    private final InvoiceGenerator invoiceGenerator;

    private final EmailService emailService;
    private final PdfInvoiceService pdfInvoiceService;
    private final UserRepository userRepository;
    private static final Logger logger =
        LoggerFactory.getLogger(InvoiceServiceImpl.class);

    public InvoiceServiceImpl(
            InvoiceRepository invoiceRepository,
            BillingCycleRepository billingCycleRepository,
            HouseholdRepository householdRepository,
            WaterUsageLogRepository waterUsageLogRepository,
            BulkWaterPurchaseRepository bulkWaterPurchaseRepository,
            MeterRepository meterRepository,
            BillingEngineService billingEngineService,
            InvoiceGenerator invoiceGenerator,
            EmailService emailService,
            PdfInvoiceService pdfInvoiceService,
            UserRepository userRepository
                ) {

        this.invoiceRepository = invoiceRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.householdRepository = householdRepository;
        this.waterUsageLogRepository = waterUsageLogRepository;
        this.bulkWaterPurchaseRepository = bulkWaterPurchaseRepository;
        this.meterRepository = meterRepository;
        this.billingEngineService = billingEngineService;
        this.invoiceGenerator = invoiceGenerator;
        this.emailService = emailService;
        this.pdfInvoiceService = pdfInvoiceService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void generateInvoices(Long billingCycleId) {

         BillingCycle billingCycle = billingCycleRepository.findById(billingCycleId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Billing cycle not found"));

        if (billingCycle.getStatus() == BillingCycleStatus.INVOICED) {
        throw new IllegalStateException(
                "Invoices have already been generated for this billing cycle.");
        }

    List<Household> households =
            householdRepository.findByApartmentId(
                    billingCycle.getApartment().getId());

    List<BulkWaterPurchase> purchases =
            bulkWaterPurchaseRepository.findByBillingCycle(
                    billingCycle);

    List<HouseholdBill> householdBills = new ArrayList<>();
    List<Invoice> invoices = new ArrayList<>();

    for (Household household : households) {

        List<WaterUsageLog> logs =
                waterUsageLogRepository.findByBillingCycleIdAndHouseholdId(
                        billingCycleId,
                        household.getId());

        double consumption = logs.stream()
                .mapToDouble(WaterUsageLog::getLitersConsumed)
                .sum() / 1000.0;

        boolean hasMeter =
                meterRepository.existsByHouseholdIdAndActiveTrue(household.getId());

        HouseholdBill bill =
                billingEngineService.calculateHouseholdBill(
                        household.getId(),
                        consumption,
                        billingCycle.getTariffPlan(),
                        hasMeter,
                        household.getFlatSize());

        householdBills.add(bill);
    }

    BillingSummary summary =
        billingEngineService.summarizeBillingCycle(
                purchases,
                householdBills);

    for (int i = 0; i < households.size(); i++) {

            Invoice invoice =
                    invoiceGenerator.generate(
                            households.get(i),
                            billingCycle,
                            householdBills.get(i));

            invoices.add(invoice);
        }

        invoiceRepository.saveAll(invoices);

        billingCycle.setStatus(BillingCycleStatus.INVOICED);

        billingCycleRepository.save(billingCycle);

    }

        @Override
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getInvoices(Long billingCycleId) {

        return invoiceRepository.findByBillingCycleId(billingCycleId)
                .stream()
                .map(this::toResponse)
                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getAll() {

        return invoiceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public InvoiceResponse getById(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        return toResponse(invoice);
        }

        @Override
        @Transactional(readOnly = true)
        public List<InvoiceResponse> getByHousehold(Long householdId) {

        return invoiceRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
        }

        @Override
        @Transactional
        public void markAsPaid(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        invoice.setStatus(InvoiceStatus.PAID);

        invoiceRepository.save(invoice);
        }

        @Override
        @Transactional
        public void emailInvoice(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found"));

        User resident = userRepository
                .findFirstByHouseholdId(
                        invoice.getHousehold().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No resident assigned to this household"));

        byte[] pdfBytes =
                pdfInvoiceService.generateInvoice(invoiceId);

        emailService.sendInvoiceEmail(

                resident.getEmail(),

                resident.getFirstName(),

                invoice,

                pdfBytes);

        invoice.setStatus(InvoiceStatus.SENT);

        invoiceRepository.save(invoice);
        }

        @Override
        @Transactional
        public BulkInvoiceEmailResponse emailInvoices(
                Long billingCycleId) {

        List<Invoice> invoices =
                invoiceRepository.findByBillingCycleId(billingCycleId);

        int emailsSent = 0;

        List<FailedInvoiceResponse> failedInvoices = new ArrayList<>();

        for (Invoice invoice : invoices) {

                try {

                User resident = userRepository
                        .findFirstByHouseholdId(
                                invoice.getHousehold().getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No resident assigned"));

                byte[] pdf =
                        pdfInvoiceService.generateInvoice(
                                invoice.getId());

                emailService.sendInvoiceEmail(

                        resident.getEmail(),

                        resident.getFirstName(),

                        invoice,

                        pdf);

                invoice.setStatus(InvoiceStatus.SENT);

                invoiceRepository.save(invoice);

                emailsSent++;

                } catch (Exception e) {

                failedInvoices.add(
                         new FailedInvoiceResponse(
                invoice.getInvoiceNumber(),
                e.getMessage())
                );

                logger.error(
                        "Failed to send invoice {}",
                        invoice.getInvoiceNumber(),
                        e);
        }
}

        return new BulkInvoiceEmailResponse(

                invoices.size(),

                emailsSent,

                failedInvoices.size(),

                failedInvoices);
        }

        private InvoiceResponse toResponse(Invoice invoice) {

        return new InvoiceResponse(

                invoice.getId(),

                invoice.getInvoiceNumber(),

                invoice.getHousehold().getId(),

                invoice.getHousehold().getFlatNumber(),

                invoice.getHousehold().getApartment().getId(),

                invoice.getHousehold().getApartment().getName(),

                invoice.getBillingCycle().getId(),

                invoice.getConsumptionKl(),

                invoice.getUsageCharge(),

                invoice.getFixedCharge(),

                invoice.getTariffCharge(),

                invoice.getDistributedCost(),

                invoice.getPurchasedRate(),

                invoice.getSharedAreaCharge(),

                invoice.getAdjustment(),

                invoice.getTotalAmount(),

                invoice.getStatus(),

                invoice.getGeneratedDate()
        );
        }
}