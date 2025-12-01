# Job Board Database ER Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string email
        string password_hash
        string full_name
        string phone
        string role
        datetime created_at
        datetime updated_at
        boolean is_verified
        string otp_code
        datetime otp_expires_at
    }
    
    COMPANIES {
        int id PK
        string company_name
        string description
        string website
        string logo_url
        int user_id FK
        datetime created_at
        datetime updated_at
    }
    
    CATEGORIES {
        int id PK
        string name
        string description
        datetime created_at
    }
    
    JOBS {
        int id PK
        string title
        text description
        string location
        string job_type
        decimal salary_min
        decimal salary_max
        int company_id FK
        int category_id FK
        int posted_by FK
        datetime created_at
        datetime updated_at
        datetime expiry_date
        boolean is_active
    }
    
    APPLICATIONS {
        int id PK
        int job_id FK
        int user_id FK
        text cover_letter
        string resume_url
        string status
        datetime applied_at
        datetime updated_at
    }
    
    USER_PROFILES {
        int id PK
        int user_id FK
        string headline
        text bio
        string experience_level
        string education
        string skills
        string resume_url
        datetime created_at
        datetime updated_at
    }
    
    SAVED_JOBS {
        int id PK
        int user_id FK
        int job_id FK
        datetime saved_at
    }
    
    USERS ||--o{ COMPANIES : "posts"
    USERS ||--o{ JOBS : "posts"
    USERS ||--o{ APPLICATIONS : "applies"
    USERS ||--|| USER_PROFILES : "has"
    USERS ||--o{ SAVED_JOBS : "saves"
    COMPANIES ||--o{ JOBS : "offers"
    CATEGORIES ||--o{ JOBS : "categorizes"
    JOBS ||--o{ APPLICATIONS : "receives"
    JOBS ||--o{ SAVED_JOBS : "saved"
```

## Table Descriptions

### USERS
Stores all user information including job seekers and employers. Contains authentication fields and OTP verification details.

### COMPANIES
Information about companies that post jobs. Linked to USERS table as employers are also users.

### CATEGORIES
Job categories like "Technology", "Healthcare", "Finance", etc.

### JOBS
Detailed job postings with all relevant information including title, description, salary range, location, etc.

### APPLICATIONS
Records of job applications made by users for specific jobs.

### USER_PROFILES
Extended profile information for job seekers including resume, skills, education, etc.

### SAVED_JOBS
Allows users to save jobs for later reference.