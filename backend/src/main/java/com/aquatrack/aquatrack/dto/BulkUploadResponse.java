package com.aquatrack.aquatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BulkUploadResponse {
    private int totalRows;
    private int successfulImports;
    private int duplicatesSkipped;
    private List<String> errors;
}
