package com.aquatrack.aquatrack.entity;

import jakarta.persistence.*;
import lombok.*;
import com.aquatrack.aquatrack.enums.HouseholdJoinRequestStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Resident requesting access
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Apartment selected by resident
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    /**
     * Household selected by resident
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "household_id")
    private Household household;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HouseholdJoinRequestStatus status;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    /**
     * Admin who approved/rejected
     */
    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(length = 500)
    private String remarks;
}
