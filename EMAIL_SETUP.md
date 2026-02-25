# Email Configuration Guide

## Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com
2. Click "Security" in the left menu
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Click "Generate"
4. Copy the 16-character password

### Step 3: Update application.properties
Replace in `src/main/resources/application.properties`:
```
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
```

Example:
```
spring.mail.username=pavan@gmail.com
spring.mail.password=abcd efgh ijkl mnop
```

### Alternative: Use Environment Variables
On Windows PowerShell:
```powershell
$env:SPRING_MAIL_USERNAME = "your-email@gmail.com"
$env:SPRING_MAIL_PASSWORD = "your-app-password"
```

### Step 4: Test
1. Register a new account
2. Click "Send OTP"
3. Check your email inbox (may be in spam)
4. Enter the OTP received

## For Other Email Providers

### Outlook
- Host: smtp-mail.outlook.com
- Port: 587
- Username: your-email@outlook.com
- Password: your-password

### Yahoo
- Host: smtp.mail.yahoo.com
- Port: 587
- Username: your-email@yahoo.com
- Password: your-app-password

### SendGrid (Recommended for Production)
- Host: smtp.sendgrid.net
- Port: 587
- Username: apikey
- Password: SG.xxxxxxxxxxxxx
