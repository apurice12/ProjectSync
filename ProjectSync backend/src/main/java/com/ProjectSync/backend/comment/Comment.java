package com.ProjectSync.backend.comment;

import com.ProjectSync.backend.appuser.AppUser;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_email", nullable = false, referencedColumnName = "email")
    @JsonBackReference
    private AppUser appUser;

    @Column(columnDefinition = "TEXT")
    private String screenName;

    @Column
    private String category;

    @Column
    private Long idAppuser;

    @Column
    private Integer Capacity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate = new Date(); // Initialize with the current Date
}

