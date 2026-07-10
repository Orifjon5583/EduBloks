# Requirements Document

## Introduction

EduBlocks — bu dasturlash ta'limiga mo'ljallangan zamonaviy veb-platforma. Platforma video darslarga emas, balki amaliy mashg'ulotlarga asoslangan. Talabalar o'qish darslari, viktorinalar, yozish mashqlari, xatolarni tuzatish, kodlash musobaqalari va Figma-to-Code loyihalari orqali o'rganadilar. Platforma gamifikatsiya, reyting, progress kuzatuv va rol asosidagi boshqaruvni o'z ichiga oladi.

## Glossary

- **Platform**: EduBlocks veb-ilovasi
- **Super_Admin**: Tizimning eng yuqori darajali boshqaruvchisi — filiallar, o'qituvchilar, guruhlar va talabalarni boshqaradi
- **Admin_Teacher**: O'qituvchi roli — faqat o'z ta'lim kontentini boshqaradi
- **Student**: Talaba roli — darslarni o'qiydi, mashqlarni bajaradi, loyihalarni yuklaydi
- **Branch**: Filial — tashkiliy bo'linma
- **Group**: Guruh — talabalar to'plami, o'qituvchiga biriktirilgan
- **XP**: Tajriba ballari — gamifikatsiya tizimidagi asosiy ball birligi
- **Rank**: Daraja — talabaning XP asosida erishgan darajasi
- **Library**: Umumiy kontent kutubxonasi — o'qituvchilar o'rtasida almashiladigan ta'lim materiallari
- **Typing_Practice**: Monkeytype uslubidagi yozish mashqi moduli
- **Quiz_Module**: Viktorina yaratish va bajarish moduli
- **Bug_Fix_Module**: Xatolarni tuzatish mashqlari moduli
- **Coding_Challenge**: Kodlash topshiriqlari moduli
- **Figma_Challenge**: Figma dizayndan kodga aylantirish loyihasi moduli
- **RBAC**: Role-Based Access Control — rolga asoslangan kirish nazorati
- **Daily_Streak**: Kunlik ketma-ketlik — talabaning uzluksiz faollik kunlari
- **Credential_Generator**: Login va parol avtomatik yaratish tizimi

## Requirements

### Requirement 1: Rolga Asoslangan Kirish Nazorati (RBAC)

**User Story:** As a Platform administrator, I want role-based access control, so that each user type has appropriate permissions and restrictions.

#### Acceptance Criteria

1. THE Platform SHALL support exactly three user roles: Super_Admin, Admin_Teacher, and Student
2. WHEN a user authenticates, THE Platform SHALL grant access only to features authorized for that user's role
3. IF an unauthorized user attempts to access a restricted resource, THEN THE Platform SHALL deny access and display an error message
4. THE Platform SHALL enforce RBAC on both client-side navigation and server-side API endpoints

### Requirement 2: Autentifikatsiya va Hisob Xavfsizligi

**User Story:** As a user, I want secure authentication, so that my account and data are protected.

#### Acceptance Criteria

1. WHEN a user provides valid credentials, THE Platform SHALL authenticate the user and create a session
2. IF a user provides invalid credentials, THEN THE Platform SHALL reject the login attempt and display an error message
3. THE Platform SHALL store passwords using a secure hashing algorithm
4. WHEN a session expires or user logs out, THE Platform SHALL invalidate the session and require re-authentication

### Requirement 3: Filial Boshqaruvi (Branch Management)

**User Story:** As a Super_Admin, I want to manage branches, so that I can organize the platform's educational centers.

#### Acceptance Criteria

1. WHEN Super_Admin creates a branch with valid data, THE Platform SHALL save the branch and display it in the branch list
2. WHEN Super_Admin edits branch details, THE Platform SHALL update the branch information
3. WHEN Super_Admin deletes a branch, THE Platform SHALL remove the branch from the system
4. IF an Admin_Teacher or Student attempts branch management, THEN THE Platform SHALL deny the action

### Requirement 4: O'qituvchi Boshqaruvi (Teacher Management)

**User Story:** As a Super_Admin, I want to manage teachers, so that I can control who delivers educational content.

#### Acceptance Criteria

1. WHEN Super_Admin creates a teacher account with valid data, THE Platform SHALL save the teacher and assign them to a specified Branch
2. WHEN Super_Admin edits a teacher's details, THE Platform SHALL update the teacher information
3. WHEN Super_Admin disables a teacher account, THE Platform SHALL prevent that teacher from logging in
4. WHEN Super_Admin deletes a teacher, THE Platform SHALL remove the teacher account from the system
5. WHEN Super_Admin assigns a teacher to a branch, THE Platform SHALL associate the teacher with that Branch

### Requirement 5: Guruh Boshqaruvi (Group Management)

**User Story:** As a Super_Admin, I want to manage groups, so that students are organized under teachers.

#### Acceptance Criteria

1. WHEN Super_Admin creates a group with valid data, THE Platform SHALL save the group
2. WHEN Super_Admin assigns a group to a teacher, THE Platform SHALL associate that group with the specified Admin_Teacher
3. WHEN Super_Admin edits a group's details, THE Platform SHALL update the group information
4. WHEN Super_Admin deletes a group, THE Platform SHALL remove the group from the system
5. IF an Admin_Teacher attempts to create or delete a group, THEN THE Platform SHALL deny the action

### Requirement 6: Talaba Boshqaruvi (Student Management)

**User Story:** As a Super_Admin, I want to manage students, so that I can control enrollment and group assignments.

#### Acceptance Criteria

1. WHEN Super_Admin adds a student with valid data, THE Platform SHALL create the student account and assign the student to a specified Group
2. WHEN Super_Admin edits a student's details, THE Platform SHALL update the student information
3. WHEN Super_Admin moves a student to a different group, THE Platform SHALL update the student's group association
4. WHEN Super_Admin removes a student from a group, THE Platform SHALL disassociate the student from that Group
5. WHEN Super_Admin deletes a student, THE Platform SHALL remove the student account from the system
6. WHEN Super_Admin resets a student's credentials, THE Platform SHALL generate new login and password for the student
7. IF an Admin_Teacher attempts to add, delete, or move a student, THEN THE Platform SHALL deny the action

### Requirement 7: Avtomatik Login va Parol Yaratish

**User Story:** As a Super_Admin, I want automatic credential generation for students, so that the enrollment process is fast and consistent.

#### Acceptance Criteria

1. WHEN Super_Admin creates a student account, THE Credential_Generator SHALL generate a login from the student's first name in lowercase followed by the number 123
2. THE Credential_Generator SHALL set the generated password to be identical to the generated login
3. IF the generated login already exists in the system, THEN THE Credential_Generator SHALL increment the numeric suffix to the next available number
4. WHEN Super_Admin resets a student's credentials, THE Credential_Generator SHALL regenerate login and password using the same algorithm

### Requirement 8: Dars Boshqaruvi (Lesson Management)

**User Story:** As an Admin_Teacher, I want to create and manage lessons, so that students have structured reading material.

#### Acceptance Criteria

1. WHEN Admin_Teacher creates a lesson with valid content, THE Platform SHALL save the lesson containing text, images, and code examples
2. WHEN Admin_Teacher edits a lesson, THE Platform SHALL update the lesson content
3. WHEN Admin_Teacher deletes a lesson, THE Platform SHALL remove the lesson from the system
4. WHEN Admin_Teacher schedules a lesson, THE Platform SHALL make the lesson visible to students at the scheduled time
5. THE Platform SHALL exclude video content from lessons

### Requirement 9: Viktorina Boshqaruvi (Quiz Management)

**User Story:** As an Admin_Teacher, I want to create and manage quizzes, so that I can assess student understanding.

#### Acceptance Criteria

1. WHEN Admin_Teacher creates a quiz with valid data, THE Quiz_Module SHALL save the quiz with questions and answers
2. WHEN Admin_Teacher sets opening and closing times for a quiz, THE Quiz_Module SHALL enforce those time boundaries
3. WHILE a quiz is outside its scheduled time window, THE Quiz_Module SHALL prevent students from accessing the quiz
4. WHEN Admin_Teacher edits a quiz, THE Quiz_Module SHALL update the quiz content
5. WHEN Admin_Teacher deletes a quiz, THE Quiz_Module SHALL remove the quiz from the system

### Requirement 10: Yozish Mashqi (Typing Practice)

**User Story:** As an Admin_Teacher, I want to create typing exercises, so that students practice IT English vocabulary.

#### Acceptance Criteria

1. WHEN Admin_Teacher creates a typing word list, THE Typing_Practice SHALL save the word list containing only English IT vocabulary
2. THE Typing_Practice SHALL support time-based modes of 15, 30, 60, and 120 seconds
3. THE Typing_Practice SHALL support word-count-based modes of 10, 25, 50, and 100 words
4. THE Typing_Practice SHALL exclude HTML tags from typing exercises
5. WHEN a student completes a typing session, THE Typing_Practice SHALL record the words-per-minute score and accuracy

### Requirement 11: Xatolarni Tuzatish Mashqi (Bug Fix Module)

**User Story:** As an Admin_Teacher, I want to create debugging exercises, so that students learn to identify and fix code errors.

#### Acceptance Criteria

1. WHEN Admin_Teacher creates a bug fix exercise with valid data, THE Bug_Fix_Module SHALL save the exercise with buggy code and expected solution
2. WHEN Admin_Teacher edits a bug fix exercise, THE Bug_Fix_Module SHALL update the exercise content
3. WHEN Admin_Teacher deletes a bug fix exercise, THE Bug_Fix_Module SHALL remove the exercise from the system
4. WHEN a student submits a fix, THE Bug_Fix_Module SHALL validate the submission against the expected solution

### Requirement 12: Kodlash Topshiriqlari (Coding Challenge)

**User Story:** As an Admin_Teacher, I want to create coding assignments, so that students practice writing code.

#### Acceptance Criteria

1. WHEN Admin_Teacher creates a coding challenge with valid data, THE Coding_Challenge SHALL save the challenge with title, description, and scoring criteria
2. WHEN Admin_Teacher edits a coding challenge, THE Coding_Challenge SHALL update the challenge content
3. WHEN Admin_Teacher deletes a coding challenge, THE Coding_Challenge SHALL remove the challenge from the system
4. WHEN a student submits a solution, THE Coding_Challenge SHALL record the submission for review

### Requirement 13: Figma Topshiriqlari (Figma Challenge)

**User Story:** As an Admin_Teacher, I want to create Figma-to-Code challenges, so that students practice converting designs into working code.

#### Acceptance Criteria

1. WHEN Admin_Teacher creates a Figma challenge, THE Figma_Challenge SHALL save the challenge with title, description, uploaded design file (PNG/JPG) or Figma link, score value, open time, and deadline
2. THE Figma_Challenge SHALL open new challenges only on odd weekdays: Monday, Wednesday, and Friday
3. WHEN a challenge opens on Monday, THE Figma_Challenge SHALL set the deadline to Tuesday at 14:00
4. WHEN a challenge opens on Wednesday, THE Figma_Challenge SHALL set the deadline to Thursday at 14:00
5. WHEN a challenge opens on Friday, THE Figma_Challenge SHALL set the deadline to Saturday at 14:00
6. WHEN the deadline passes, THE Figma_Challenge SHALL automatically close the upload capability for that challenge
7. WHEN a student submits a Figma project, THE Figma_Challenge SHALL accept a ZIP file upload, GitHub repository link, and live demo link

### Requirement 14: Figma Topshiriqlarni Baholash (Figma Manual Review)

**User Story:** As an Admin_Teacher, I want to manually review Figma submissions, so that I can give personalized feedback and scores.

#### Acceptance Criteria

1. WHEN Admin_Teacher opens a Figma submission, THE Platform SHALL display the submission details including ZIP download link, GitHub link, and live demo link
2. WHEN Admin_Teacher assigns a score to a submission, THE Platform SHALL record the score and associate it with the student
3. WHEN Admin_Teacher writes feedback for a submission, THE Platform SHALL save and display the feedback to the student

### Requirement 15: Kontent Kutubxonasi (Shared Library)

**User Story:** As an Admin_Teacher, I want to share and copy content from a shared library, so that teachers can reuse high-quality educational materials.

#### Acceptance Criteria

1. WHEN Admin_Teacher saves content to the Library, THE Platform SHALL store a copy of the content (Quiz, Bug Fix, Coding Challenge, or Figma Challenge) in the shared Library
2. WHEN Admin_Teacher copies content from the Library, THE Platform SHALL create an independent duplicate in that teacher's account
3. WHEN Admin_Teacher modifies a copied item, THE Platform SHALL update only the teacher's copy and leave the original Library item unchanged
4. THE Library SHALL support Quiz, Bug Fix, Coding Challenge, and Figma Challenge content types

### Requirement 16: Progress Qoidalari (Content Locking)

**User Story:** As a Student, I want content to unlock progressively, so that I learn topics in the correct order.

#### Acceptance Criteria

1. WHILE a student has not completed all exercises for a topic, THE Platform SHALL lock exercises from subsequent topics for that student
2. WHEN a student completes all exercises for a topic, THE Platform SHALL unlock the next topic's exercises
3. THE Platform SHALL apply progress locking to Quiz, Typing, Bug Fix, Coding Challenge, and Figma Challenge modules
4. THE Platform SHALL determine topic completion based on the student's completed lesson and exercise history

### Requirement 17: Gamifikatsiya Tizimi

**User Story:** As a Student, I want gamification elements, so that I stay motivated to continue learning.

#### Acceptance Criteria

1. WHEN a student completes an exercise or activity, THE Platform SHALL award XP based on the activity's configured score value
2. THE Platform SHALL assign ranks based on accumulated XP: Beginner, Student, Junior, Middle, Senior, Master, and Legend
3. WHEN a student's XP reaches the threshold for the next rank, THE Platform SHALL promote the student to that rank
4. THE Platform SHALL track and display a Daily_Streak counter for consecutive days of activity
5. WHEN a student misses a day of activity, THE Platform SHALL reset the Daily_Streak counter to zero
6. THE Platform SHALL display per-course progress percentages for HTML, CSS, JavaScript, Typing, Quiz, and Projects
7. THE Platform SHALL award achievements and badges when students reach defined milestones

### Requirement 18: Reyting va Liderlar Jadvali (Leaderboard)

**User Story:** As a Student, I want to see rankings, so that I can compare my progress with peers and stay competitive.

#### Acceptance Criteria

1. THE Platform SHALL display a leaderboard ranking students by XP within their Group
2. THE Platform SHALL display rankings at Branch, Teacher, Group, and individual Student levels for Super_Admin
3. WHEN a student earns or loses XP, THE Platform SHALL update the leaderboard in real time
4. THE Platform SHALL display the student's current position in the leaderboard on the Student dashboard

### Requirement 19: XP Tasdiqlash Tizimi (XP Approval)

**User Story:** As a Super_Admin, I want to approve or reject manual XP requests, so that XP distribution remains fair and controlled.

#### Acceptance Criteria

1. WHEN Admin_Teacher submits a manual XP request for a student, THE Platform SHALL add the request to the Super_Admin's XP approval queue
2. WHEN Super_Admin approves an XP request, THE Platform SHALL add the requested XP to the student's total
3. WHEN Super_Admin rejects an XP request, THE Platform SHALL discard the request and notify the Admin_Teacher

### Requirement 20: Tizim Loglari (System Logs)

**User Story:** As a Super_Admin, I want system activity logs, so that I can audit actions performed on the platform.

#### Acceptance Criteria

1. WHEN a user logs in, THE Platform SHALL record a log entry with timestamp, user identifier, and action type
2. WHEN a quiz or assignment is created, THE Platform SHALL record a log entry with details of the creation
3. WHEN XP is changed for a student, THE Platform SHALL record a log entry with the previous value, new value, and reason
4. WHEN a password is reset, THE Platform SHALL record a log entry with the affected student identifier
5. WHEN a student is moved between groups, THE Platform SHALL record a log entry with old and new group identifiers
6. WHEN a group is modified, THE Platform SHALL record a log entry with the change details
7. THE Platform SHALL display system logs to Super_Admin with filtering and search capabilities

### Requirement 21: Chat Tizimi (Real-time Communication)

**User Story:** As a user, I want real-time chat, so that I can communicate with relevant parties on the platform.

#### Acceptance Criteria

1. THE Platform SHALL provide real-time chat functionality between Admin_Teacher and Super_Admin
2. THE Platform SHALL provide real-time chat functionality between Admin_Teacher and students in the teacher's assigned groups
3. WHEN a user sends a message, THE Platform SHALL deliver the message to the recipient in real time
4. IF a recipient is offline, THEN THE Platform SHALL store the message and deliver it when the recipient returns online
5. THE Platform SHALL restrict Student chat to only their assigned Admin_Teacher

### Requirement 22: Super Admin Dashboard

**User Story:** As a Super_Admin, I want a comprehensive dashboard, so that I can monitor the entire platform's performance at a glance.

#### Acceptance Criteria

1. THE Platform SHALL display total counts for Branches, Teachers, Groups, and Students on the Super_Admin dashboard
2. THE Platform SHALL display Active Users, Total XP distributed, and Total Quizzes on the Super_Admin dashboard
3. THE Platform SHALL display Active Challenges and Active Figma Tasks on the Super_Admin dashboard
4. THE Platform SHALL display multi-level rankings (Branch, Teacher, Group, Student) on the Super_Admin dashboard
5. THE Platform SHALL display pending XP approval requests on the Super_Admin dashboard
6. THE Platform SHALL display recent system log entries on the Super_Admin dashboard

### Requirement 23: Teacher Dashboard

**User Story:** As an Admin_Teacher, I want a focused dashboard, so that I can manage my teaching activities efficiently.

#### Acceptance Criteria

1. THE Platform SHALL display the teacher's assigned groups on the Admin_Teacher dashboard
2. THE Platform SHALL display student rankings within the teacher's groups on the Admin_Teacher dashboard
3. THE Platform SHALL display pending review submissions on the Admin_Teacher dashboard
4. THE Platform SHALL display active quizzes and their statuses on the Admin_Teacher dashboard
5. THE Platform SHALL display active Figma challenges and their statuses on the Admin_Teacher dashboard

### Requirement 24: Student Dashboard

**User Story:** As a Student, I want a personalized dashboard, so that I can track my learning progress and see upcoming tasks.

#### Acceptance Criteria

1. THE Platform SHALL display a "Continue Learning" section showing the student's next uncompleted lesson on the Student dashboard
2. THE Platform SHALL display the student's current XP, Rank, Level, and Daily_Streak on the Student dashboard
3. THE Platform SHALL display upcoming deadlines for assigned exercises on the Student dashboard
4. THE Platform SHALL display per-course progress percentages on the Student dashboard
5. THE Platform SHALL display currently assigned exercises and challenges on the Student dashboard

### Requirement 25: Student Ta'lim Faoliyatlari

**User Story:** As a Student, I want to access all learning activities, so that I can practice and improve my programming skills.

#### Acceptance Criteria

1. WHEN a student opens a lesson, THE Platform SHALL display the lesson content with text, images, and code examples
2. WHEN a student takes a quiz, THE Quiz_Module SHALL present questions and record the student's answers
3. WHEN a student completes a quiz, THE Quiz_Module SHALL calculate and display the score
4. WHEN a student starts a typing session, THE Typing_Practice SHALL present words and track typing speed and accuracy
5. WHEN a student submits a bug fix solution, THE Bug_Fix_Module SHALL validate and record the result
6. WHEN a student submits a coding challenge solution, THE Coding_Challenge SHALL record the submission
7. WHEN a student uploads a Figma project before the deadline, THE Figma_Challenge SHALL accept and store the submission

### Requirement 26: Bildirishnoma Tizimi (Notification System)

**User Story:** As a user, I want notifications, so that I am informed of important events and deadlines.

#### Acceptance Criteria

1. WHEN a new assignment is published, THE Platform SHALL notify affected students
2. WHEN a deadline is approaching, THE Platform SHALL notify the student with a countdown timer
3. WHEN Admin_Teacher provides feedback on a submission, THE Platform SHALL notify the student
4. WHEN an XP request is approved or rejected, THE Platform SHALL notify the relevant Admin_Teacher
5. THE Platform SHALL display unread notification count in the navigation bar

### Requirement 27: Foydalanuvchi Interfeysi (UI/UX)

**User Story:** As a user, I want a modern and responsive interface, so that I can use the platform comfortably on any device.

#### Acceptance Criteria

1. THE Platform SHALL provide a responsive design that adapts to desktop, tablet, and mobile screen sizes
2. THE Platform SHALL support Dark Mode and Light Mode themes
3. WHEN a user switches theme preference, THE Platform SHALL apply the selected theme immediately and persist the preference
4. THE Platform SHALL provide search functionality with filters across all list views
5. THE Platform SHALL implement pagination for all list views displaying more than 20 items
6. THE Platform SHALL display countdown timers for active deadlines

### Requirement 28: Fayl Yuklash Tizimi (File Upload)

**User Story:** As a user, I want to upload files, so that I can submit projects and design materials.

#### Acceptance Criteria

1. WHEN Admin_Teacher uploads a design file for a Figma challenge, THE Platform SHALL accept PNG, JPG, and Figma link formats
2. WHEN a student uploads a project submission, THE Platform SHALL accept ZIP file format
3. IF an uploaded file exceeds the maximum allowed size, THEN THE Platform SHALL reject the upload and display the size limit
4. IF an uploaded file has an unsupported format, THEN THE Platform SHALL reject the upload and display supported formats
5. THE Platform SHALL store uploaded files securely and provide download links to authorized users
