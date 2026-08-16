/* passwords are same bcrypt hash of "password123" */
INSERT INTO `Users` (`user_name`, `user_email`, `user_password`)
VALUES
('Michelino Gali', 'mic@test.com', '$2b$10$/EMog8YUsltV4sJvdM64tO/DFceIsYFooyWJoWSxqXG0cJKNQmBQi'),
('Stephen Guthery', 'stephen@test.com', '$2b$10$/EMog8YUsltV4sJvdM64tO/DFceIsYFooyWJoWSxqXG0cJKNQmBQi'),
('Gurveer Singh', 'gurveer@test.com', '$2b$10$/EMog8YUsltV4sJvdM64tO/DFceIsYFooyWJoWSxqXG0cJKNQmBQi');

INSERT INTO `Jobs` (`user_id`, `job_company`, `job_title`, `job_location`, `job_website`, `job_date_applied`, `job_status`, `job_notes`)
VALUES
(1, 'Google', 'Software Engineer Intern', 'Mountain View, CA', 'https://careers.google.com', '2026-01-15', 'Interviewing', 'Passed first round'),
(1, 'Amazon', 'Software Development Engineer', 'Seattle, WA', 'https://amazon.jobs', '2026-01-20', 'Applied', NULL),
(1, 'Meta', 'Frontend Intern', 'Menlo Park, CA', NULL, '2026-02-01', 'Rejected', 'No feedback given'),
(2, 'Microsoft', 'Full Stack Developer', 'Redmond, WA', 'https://careers.microsoft.com', '2026-01-10', 'Offer', 'Accepted offer'),
(2, 'Apple', 'iOS Intern', 'Cupertino, CA', NULL, '2026-02-05', 'Waiting', NULL),
(3, 'Netflix', 'Backend Engineer', 'Los Gatos, CA', 'https://jobs.netflix.com', '2026-01-25', 'Applied', NULL);

INSERT INTO `Skills` (`user_id`, `skill_name`, `skill_category`, `skill_level`)
VALUES
(1, 'Python', 'Language', 'Advanced'),
(1, 'JavaScript', 'Language', 'Intermediate'),
(1, 'MySQL', 'Database', 'Intermediate'),
(1, 'Git', 'Version Control', 'Advanced'),
(2, 'Java', 'Language', 'Advanced'),
(2, 'React', 'Framework', 'Intermediate'),
(2, 'Docker', 'Tool', 'Beginner'),
(3, 'Python', 'Language', 'Intermediate'),
(3, 'PostgreSQL', 'Database', 'Beginner'),
(3, 'AWS', 'Cloud Platforms', 'Beginner');

INSERT INTO `Jobs_Skills` (`job_id`, `skill_id`)
VALUES
-- Google job = Python, JavaScript, MySQL
(1, 1),
(1, 2),
(1, 3),
-- Amazon job = Python, Git
(2, 1),
(2, 4),
-- Meta job = JavaScript
(3, 2),
-- Microsoft job = Java, React
(4, 5),
(4, 6),
-- Apple job = Docker
(5, 7),
-- Netflix job = Python, PostgreSQL
(6, 8),
(6, 9);

-- Sample Contacts
INSERT INTO `Contacts` (`user_id`, `job_id`, `contact_name`, `contact_email`, `contact_linkedin`, `contact_notes`)
VALUES
(1, 1, 'SpongeBob SquarePants', 'spongebob@google.com', 'linkedin.com/in/spongebob', 'Recruiter for Google internship'),
(1, 2, 'Patrick Star', 'pstar@amazon.com', NULL, 'Referred by professor'),
(2, 4, 'Squidward Tentacles', 'squidward@microsoft.com', 'linkedin.com/in/squidward', 'Hiring manager'),
(3, 6, 'Sandy Cheeks', NULL, 'linkedin.com/in/sandycheeks', 'Met at career fair'),
-- contacts don't need to be linked to a job either
(1, NULL, 'Mr. Krabs', 'mrkrabs@gmail.com', 'linkedin.com/in/mrkrabs', 'General networking contact');