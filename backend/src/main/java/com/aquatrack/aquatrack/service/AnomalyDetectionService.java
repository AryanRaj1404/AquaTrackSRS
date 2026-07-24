package com.aquatrack.aquatrack.service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnomalyDetectionService {

    private static final double SIGMA_THRESHOLD = 2.0;
    private static final int MIN_HISTORY_SIZE = 5;

    public static class AnomalyResult {
        public final boolean anomalous;
        public final double mean;
        public final double stdDev;
        public AnomalyResult(boolean anomalous, double mean, double stdDev) {
            this.anomalous = anomalous;
            this.mean = mean;
            this.stdDev = stdDev;
        }
    }

    public AnomalyResult checkForAnomaly(List<Double> historicalReadings, double todayReading) {
        if (historicalReadings == null || historicalReadings.size() < MIN_HISTORY_SIZE) {
            return new AnomalyResult(false, 0, 0);
        }
        double mean = historicalReadings.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double variance = historicalReadings.stream().mapToDouble(v -> Math.pow(v - mean, 2)).average().orElse(0.0);
        double stdDev = Math.sqrt(variance);
        double threshold = mean + (SIGMA_THRESHOLD * stdDev);
        return new AnomalyResult(todayReading > threshold, round2(mean), round2(stdDev));
    }

    private double round2(double v) { return Math.round(v * 100.0) / 100.0; }
}