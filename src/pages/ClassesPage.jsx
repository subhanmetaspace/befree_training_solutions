
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, Lock, Play, FileText, ChevronDown, ChevronUp, X, Search, Filter } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const COURSES = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals",
    description: "Build the foundation of web development with HTML5 and CSS3. Learn to create structured, styled web pages from scratch.",
    category: "Web Development",
    level: "Beginner",
    duration_minutes: 300,
    plan_required: "Starter",
    instructor: "Rahul Sharma",
    thumbnail: "🌐",
    lectures: [
      { id: 1, title: "Introduction to HTML", duration: "18 min", free: true },
      { id: 2, title: "HTML Tags & Structure", duration: "22 min", free: false },
      { id: 3, title: "CSS Basics & Selectors", duration: "25 min", free: false },
      { id: 4, title: "Box Model & Layouts", duration: "28 min", free: false },
      { id: 5, title: "Flexbox & Grid", duration: "35 min", free: false },
      { id: 6, title: "Responsive Design", duration: "30 min", free: false },
      { id: 7, title: "CSS Animations", duration: "20 min", free: false },
      { id: 8, title: "Final Project", duration: "42 min", free: false },
    ],
    notes: ["HTML Cheatsheet.pdf", "CSS Reference Guide.pdf", "Project Starter Files.zip"],
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    description: "Master the programming language of the web. Cover variables, functions, DOM manipulation, ES6+ features, and async programming.",
    category: "Web Development",
    level: "Beginner",
    duration_minutes: 420,
    plan_required: "Starter",
    instructor: "Priya Singh",
    thumbnail: "⚡",
    lectures: [
      { id: 1, title: "JavaScript Basics", duration: "20 min", free: true },
      { id: 2, title: "Variables & Data Types", duration: "22 min", free: false },
      { id: 3, title: "Functions & Scope", duration: "28 min", free: false },
      { id: 4, title: "Arrays & Objects", duration: "30 min", free: false },
      { id: 5, title: "DOM Manipulation", duration: "35 min", free: false },
      { id: 6, title: "ES6+ Features", duration: "40 min", free: false },
      { id: 7, title: "Promises & Async/Await", duration: "38 min", free: false },
      { id: 8, title: "Mini Projects", duration: "45 min", free: false },
    ],
    notes: ["JS Cheatsheet.pdf", "ES6 Features Guide.pdf", "Practice Exercises.pdf"],
  },
  {
    id: 3,
    title: "Python for Beginners",
    description: "Start your programming journey with Python. Learn syntax, data structures, OOP, and build real-world scripts and automation tools.",
    category: "Programming",
    level: "Beginner",
    duration_minutes: 360,
    plan_required: "Starter",
    instructor: "Amit Verma",
    thumbnail: "🐍",
    lectures: [
      { id: 1, title: "Python Setup & Basics", duration: "15 min", free: true },
      { id: 2, title: "Variables & Data Types", duration: "20 min", free: false },
      { id: 3, title: "Control Flow", duration: "25 min", free: false },
      { id: 4, title: "Functions & Modules", duration: "30 min", free: false },
      { id: 5, title: "Lists, Tuples & Dicts", duration: "28 min", free: false },
      { id: 6, title: "OOP in Python", duration: "35 min", free: false },
      { id: 7, title: "File Handling", duration: "22 min", free: false },
      { id: 8, title: "Automation Scripts", duration: "40 min", free: false },
    ],
    notes: ["Python Cheatsheet.pdf", "OOP Concepts.pdf", "Automation Projects.pdf"],
  },
  {
    id: 4,
    title: "SEO & Content Marketing",
    description: "Rank higher on Google. Learn on-page SEO, keyword research, link building, content strategy, and Google Search Console.",
    category: "Digital Marketing",
    level: "Beginner",
    duration_minutes: 280,
    plan_required: "Starter",
    instructor: "Neha Gupta",
    thumbnail: "🔍",
    lectures: [
      { id: 1, title: "What is SEO?", duration: "15 min", free: true },
      { id: 2, title: "Keyword Research", duration: "25 min", free: false },
      { id: 3, title: "On-Page SEO", duration: "30 min", free: false },
      { id: 4, title: "Off-Page & Link Building", duration: "28 min", free: false },
      { id: 5, title: "Technical SEO", duration: "35 min", free: false },
      { id: 6, title: "Google Search Console", duration: "22 min", free: false },
      { id: 7, title: "Content Strategy", duration: "25 min", free: false },
    ],
    notes: ["SEO Checklist.pdf", "Keyword Research Template.xlsx", "Content Calendar.pdf"],
  },
  {
    id: 5,
    title: "Microsoft Excel & Data Analysis",
    description: "Master Excel from basics to advanced. Formulas, pivot tables, VLOOKUP, charts, dashboards, and data analysis techniques.",
    category: "Data & Analytics",
    level: "Beginner",
    duration_minutes: 320,
    plan_required: "Starter",
    instructor: "Vikram Patel",
    thumbnail: "📊",
    lectures: [
      { id: 1, title: "Excel Interface & Basics", duration: "18 min", free: true },
      { id: 2, title: "Formulas & Functions", duration: "30 min", free: false },
      { id: 3, title: "VLOOKUP & HLOOKUP", duration: "25 min", free: false },
      { id: 4, title: "Pivot Tables", duration: "28 min", free: false },
      { id: 5, title: "Charts & Graphs", duration: "22 min", free: false },
      { id: 6, title: "Data Validation", duration: "20 min", free: false },
      { id: 7, title: "Dashboard Creation", duration: "38 min", free: false },
    ],
    notes: ["Excel Functions List.pdf", "Practice Datasets.xlsx", "Dashboard Template.xlsx"],
  },
  {
    id: 6,
    title: "Graphic Design with Canva",
    description: "Create professional designs without any design background. Social media graphics, presentations, logos, and brand identity.",
    category: "Design",
    level: "Beginner",
    duration_minutes: 240,
    plan_required: "Starter",
    instructor: "Sneha Joshi",
    thumbnail: "🎨",
    lectures: [
      { id: 1, title: "Canva Basics", duration: "15 min", free: true },
      { id: 2, title: "Design Principles", duration: "20 min", free: false },
      { id: 3, title: "Social Media Graphics", duration: "25 min", free: false },
      { id: 4, title: "Logo Design", duration: "30 min", free: false },
      { id: 5, title: "Presentations", duration: "22 min", free: false },
      { id: 6, title: "Brand Kit", duration: "28 min", free: false },
    ],
    notes: ["Design Principles Guide.pdf", "Color Theory.pdf", "Brand Identity Template.pdf"],
  },
  {
    id: 7,
    title: "React.js — Build Modern UIs",
    description: "Build fast, dynamic web applications with React. Components, hooks, state management, React Router, and API integration.",
    category: "Web Development",
    level: "Intermediate",
    duration_minutes: 480,
    plan_required: "Professional",
    instructor: "Rahul Sharma",
    thumbnail: "⚛️",
    lectures: [
      { id: 1, title: "React Introduction & JSX", duration: "20 min", free: true },
      { id: 2, title: "Components & Props", duration: "25 min", free: false },
      { id: 3, title: "State & Lifecycle", duration: "30 min", free: false },
      { id: 4, title: "Hooks (useState, useEffect)", duration: "35 min", free: false },
      { id: 5, title: "React Router", duration: "28 min", free: false },
      { id: 6, title: "Context API", duration: "32 min", free: false },
      { id: 7, title: "API Integration", duration: "38 min", free: false },
      { id: 8, title: "React Query & TanStack", duration: "35 min", free: false },
      { id: 9, title: "Full Project Build", duration: "50 min", free: false },
    ],
    notes: ["React Hooks Guide.pdf", "Component Patterns.pdf", "Project Source Code.zip"],
  },
  {
    id: 8,
    title: "Node.js & Express Backend",
    description: "Build scalable REST APIs with Node.js and Express. JWT auth, middleware, database integration, file uploads, and deployment.",
    category: "Web Development",
    level: "Intermediate",
    duration_minutes: 450,
    plan_required: "Professional",
    instructor: "Amit Verma",
    thumbnail: "🟢",
    lectures: [
      { id: 1, title: "Node.js Basics", duration: "20 min", free: true },
      { id: 2, title: "Express Framework", duration: "25 min", free: false },
      { id: 3, title: "REST API Design", duration: "30 min", free: false },
      { id: 4, title: "JWT Authentication", duration: "35 min", free: false },
      { id: 5, title: "MySQL & Sequelize ORM", duration: "40 min", free: false },
      { id: 6, title: "File Uploads", duration: "25 min", free: false },
      { id: 7, title: "Error Handling", duration: "22 min", free: false },
      { id: 8, title: "API Deployment", duration: "30 min", free: false },
    ],
    notes: ["REST API Best Practices.pdf", "JWT Guide.pdf", "Postman Collection.json"],
  },
  {
    id: 9,
    title: "Digital Marketing Mastery",
    description: "Run successful campaigns across Google Ads, Meta Ads, Email Marketing, and Analytics. Grow businesses online with proven strategies.",
    category: "Digital Marketing",
    level: "Intermediate",
    duration_minutes: 400,
    plan_required: "Professional",
    instructor: "Neha Gupta",
    thumbnail: "📱",
    lectures: [
      { id: 1, title: "Digital Marketing Overview", duration: "18 min", free: true },
      { id: 2, title: "Google Ads (Search)", duration: "35 min", free: false },
      { id: 3, title: "Google Ads (Display & Video)", duration: "30 min", free: false },
      { id: 4, title: "Meta Ads (Facebook & Instagram)", duration: "40 min", free: false },
      { id: 5, title: "Email Marketing", duration: "28 min", free: false },
      { id: 6, title: "Google Analytics 4", duration: "35 min", free: false },
      { id: 7, title: "Campaign Optimization", duration: "32 min", free: false },
      { id: 8, title: "Case Studies & ROI", duration: "38 min", free: false },
    ],
    notes: ["Ad Copywriting Templates.pdf", "Campaign Tracker.xlsx", "Analytics Setup Guide.pdf"],
  },
  {
    id: 10,
    title: "MySQL & Database Design",
    description: "Design and manage relational databases. SQL queries, joins, indexes, stored procedures, and database normalization.",
    category: "Database",
    level: "Intermediate",
    duration_minutes: 350,
    plan_required: "Professional",
    instructor: "Vikram Patel",
    thumbnail: "🗄️",
    lectures: [
      { id: 1, title: "Database Concepts", duration: "18 min", free: true },
      { id: 2, title: "SQL Basics (SELECT, INSERT)", duration: "25 min", free: false },
      { id: 3, title: "JOINs & Subqueries", duration: "30 min", free: false },
      { id: 4, title: "Database Design & ERD", duration: "35 min", free: false },
      { id: 5, title: "Indexes & Performance", duration: "28 min", free: false },
      { id: 6, title: "Stored Procedures", duration: "32 min", free: false },
      { id: 7, title: "Transactions & ACID", duration: "25 min", free: false },
    ],
    notes: ["SQL Cheatsheet.pdf", "Database Design Guide.pdf", "Practice Queries.sql"],
  },
  {
    id: 11,
    title: "Python for Data Science",
    description: "Analyze data with Python using Pandas, NumPy, Matplotlib, and Seaborn. Real-world datasets, EDA, and visualization projects.",
    category: "Data & Analytics",
    level: "Intermediate",
    duration_minutes: 460,
    plan_required: "Professional",
    instructor: "Priya Singh",
    thumbnail: "📈",
    lectures: [
      { id: 1, title: "Data Science Overview", duration: "15 min", free: true },
      { id: 2, title: "NumPy Fundamentals", duration: "28 min", free: false },
      { id: 3, title: "Pandas for Data Analysis", duration: "40 min", free: false },
      { id: 4, title: "Data Cleaning", duration: "35 min", free: false },
      { id: 5, title: "Exploratory Data Analysis", duration: "38 min", free: false },
      { id: 6, title: "Matplotlib & Seaborn", duration: "32 min", free: false },
      { id: 7, title: "Real-World Projects", duration: "50 min", free: false },
    ],
    notes: ["Pandas Cheatsheet.pdf", "Sample Datasets.zip", "EDA Templates.ipynb"],
  },
  {
    id: 12,
    title: "WordPress Website Development",
    description: "Build professional websites with WordPress. Themes, plugins, WooCommerce, SEO, page builders, and site maintenance.",
    category: "Web Development",
    level: "Beginner",
    duration_minutes: 300,
    plan_required: "Starter",
    instructor: "Sneha Joshi",
    thumbnail: "🌍",
    lectures: [
      { id: 1, title: "WordPress Setup", duration: "18 min", free: true },
      { id: 2, title: "Themes & Customization", duration: "25 min", free: false },
      { id: 3, title: "Essential Plugins", duration: "22 min", free: false },
      { id: 4, title: "Page Builder (Elementor)", duration: "35 min", free: false },
      { id: 5, title: "WooCommerce Store", duration: "40 min", free: false },
      { id: 6, title: "SEO with Yoast", duration: "28 min", free: false },
      { id: 7, title: "Security & Backups", duration: "22 min", free: false },
    ],
    notes: ["WordPress Setup Guide.pdf", "Essential Plugins List.pdf", "WooCommerce Checklist.pdf"],
  },
  {
    id: 13,
    title: "Social Media Marketing",
    description: "Grow brands on Instagram, LinkedIn, Twitter/X, and YouTube. Content creation, scheduling, engagement strategies, and analytics.",
    category: "Digital Marketing",
    level: "Beginner",
    duration_minutes: 260,
    plan_required: "Starter",
    instructor: "Neha Gupta",
    thumbnail: "📣",
    lectures: [
      { id: 1, title: "Social Media Strategy", duration: "18 min", free: true },
      { id: 2, title: "Instagram Growth", duration: "25 min", free: false },
      { id: 3, title: "LinkedIn for Business", duration: "22 min", free: false },
      { id: 4, title: "Content Creation", duration: "28 min", free: false },
      { id: 5, title: "Video & Reels", duration: "30 min", free: false },
      { id: 6, title: "Analytics & Insights", duration: "25 min", free: false },
    ],
    notes: ["Content Calendar Template.xlsx", "Hashtag Strategy Guide.pdf", "Analytics Dashboard.pdf"],
  },
  {
    id: 14,
    title: "Full-Stack Web Development",
    description: "Build complete web applications from frontend to backend. React + Node.js + MySQL + REST APIs + Deployment on cloud.",
    category: "Web Development",
    level: "Advanced",
    duration_minutes: 720,
    plan_required: "Enterprise",
    instructor: "Rahul Sharma",
    thumbnail: "🚀",
    lectures: [
      { id: 1, title: "Project Architecture", duration: "20 min", free: true },
      { id: 2, title: "Frontend with React", duration: "60 min", free: false },
      { id: 3, title: "Backend with Node.js", duration: "55 min", free: false },
      { id: 4, title: "Database Design", duration: "45 min", free: false },
      { id: 5, title: "Authentication & Security", duration: "50 min", free: false },
      { id: 6, title: "File Upload & Storage", duration: "35 min", free: false },
      { id: 7, title: "Payment Integration", duration: "40 min", free: false },
      { id: 8, title: "Testing & Debugging", duration: "38 min", free: false },
      { id: 9, title: "Docker & Deployment", duration: "45 min", free: false },
      { id: 10, title: "CI/CD Pipeline", duration: "35 min", free: false },
    ],
    notes: ["Project Architecture Diagram.pdf", "Full Source Code.zip", "Deployment Guide.pdf"],
  },
  {
    id: 15,
    title: "Machine Learning with Python",
    description: "Build ML models with Scikit-learn. Linear regression, classification, clustering, model evaluation, and real datasets.",
    category: "AI & ML",
    level: "Advanced",
    duration_minutes: 600,
    plan_required: "Enterprise",
    instructor: "Priya Singh",
    thumbnail: "🤖",
    lectures: [
      { id: 1, title: "ML Fundamentals", duration: "20 min", free: true },
      { id: 2, title: "Data Preprocessing", duration: "35 min", free: false },
      { id: 3, title: "Linear & Logistic Regression", duration: "40 min", free: false },
      { id: 4, title: "Decision Trees & Random Forests", duration: "38 min", free: false },
      { id: 5, title: "Support Vector Machines", duration: "35 min", free: false },
      { id: 6, title: "Clustering (K-Means)", duration: "30 min", free: false },
      { id: 7, title: "Model Evaluation", duration: "32 min", free: false },
      { id: 8, title: "Real-World ML Projects", duration: "55 min", free: false },
    ],
    notes: ["ML Algorithms Guide.pdf", "Scikit-learn Cheatsheet.pdf", "Project Notebooks.zip"],
  },
  {
    id: 16,
    title: "AWS Cloud Computing",
    description: "Deploy and manage cloud infrastructure on AWS. EC2, S3, RDS, Lambda, IAM, and core cloud architecture patterns.",
    category: "Cloud & DevOps",
    level: "Advanced",
    duration_minutes: 540,
    plan_required: "Enterprise",
    instructor: "Vikram Patel",
    thumbnail: "☁️",
    lectures: [
      { id: 1, title: "Cloud & AWS Overview", duration: "20 min", free: true },
      { id: 2, title: "EC2 & Compute", duration: "40 min", free: false },
      { id: 3, title: "S3 & Storage", duration: "35 min", free: false },
      { id: 4, title: "RDS & Databases", duration: "38 min", free: false },
      { id: 5, title: "IAM & Security", duration: "35 min", free: false },
      { id: 6, title: "Lambda & Serverless", duration: "40 min", free: false },
      { id: 7, title: "VPC & Networking", duration: "38 min", free: false },
      { id: 8, title: "CloudFormation", duration: "35 min", free: false },
    ],
    notes: ["AWS Services Overview.pdf", "Architecture Patterns.pdf", "Cost Optimization Guide.pdf"],
  },
  {
    id: 17,
    title: "Cybersecurity Fundamentals",
    description: "Protect systems and networks. Learn ethical hacking basics, network security, OWASP Top 10, penetration testing concepts.",
    category: "Cybersecurity",
    level: "Intermediate",
    duration_minutes: 420,
    plan_required: "Professional",
    instructor: "Amit Verma",
    thumbnail: "🔒",
    lectures: [
      { id: 1, title: "Cybersecurity Introduction", duration: "18 min", free: true },
      { id: 2, title: "Network Security Basics", duration: "30 min", free: false },
      { id: 3, title: "OWASP Top 10", duration: "35 min", free: false },
      { id: 4, title: "SQL Injection & XSS", duration: "32 min", free: false },
      { id: 5, title: "Ethical Hacking Basics", duration: "40 min", free: false },
      { id: 6, title: "Encryption & Protocols", duration: "28 min", free: false },
      { id: 7, title: "Security Auditing", duration: "35 min", free: false },
    ],
    notes: ["OWASP Top 10 Reference.pdf", "Security Checklist.pdf", "Ethical Hacking Tools.pdf"],
  },
  {
    id: 18,
    title: "Adobe Photoshop — Professional Editing",
    description: "Master image editing and graphic design. Photo retouching, compositing, typography, print design, and UI mockups.",
    category: "Design",
    level: "Intermediate",
    duration_minutes: 380,
    plan_required: "Professional",
    instructor: "Sneha Joshi",
    thumbnail: "🖼️",
    lectures: [
      { id: 1, title: "Photoshop Interface", duration: "15 min", free: true },
      { id: 2, title: "Selection Tools", duration: "25 min", free: false },
      { id: 3, title: "Layers & Masks", duration: "30 min", free: false },
      { id: 4, title: "Photo Retouching", duration: "35 min", free: false },
      { id: 5, title: "Color Correction", duration: "28 min", free: false },
      { id: 6, title: "Typography in Photoshop", duration: "22 min", free: false },
      { id: 7, title: "UI Design Mockups", duration: "38 min", free: false },
    ],
    notes: ["Photoshop Shortcuts.pdf", "Design Assets Pack.zip", "Retouching Guide.pdf"],
  },
  {
    id: 19,
    title: "Git & GitHub — Version Control",
    description: "Collaborate on code professionally. Git commands, branching, merging, pull requests, GitHub Actions, and open source contribution.",
    category: "Programming",
    level: "Beginner",
    duration_minutes: 220,
    plan_required: "Starter",
    instructor: "Rahul Sharma",
    thumbnail: "🔀",
    lectures: [
      { id: 1, title: "What is Git?", duration: "12 min", free: true },
      { id: 2, title: "Git Init & Basics", duration: "20 min", free: false },
      { id: 3, title: "Branching & Merging", duration: "25 min", free: false },
      { id: 4, title: "GitHub Remote", duration: "22 min", free: false },
      { id: 5, title: "Pull Requests", duration: "20 min", free: false },
      { id: 6, title: "GitHub Actions CI/CD", duration: "28 min", free: false },
    ],
    notes: ["Git Commands Cheatsheet.pdf", "Git Workflow Diagram.pdf", "GitHub Actions Guide.pdf"],
  },
  {
    id: 20,
    title: "Docker & DevOps Basics",
    description: "Containerize applications with Docker. Docker Compose, CI/CD pipelines, Nginx reverse proxy, and deployment workflows.",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration_minutes: 400,
    plan_required: "Professional",
    instructor: "Vikram Patel",
    thumbnail: "🐳",
    lectures: [
      { id: 1, title: "DevOps & Docker Intro", duration: "18 min", free: true },
      { id: 2, title: "Docker Images & Containers", duration: "30 min", free: false },
      { id: 3, title: "Dockerfile", duration: "28 min", free: false },
      { id: 4, title: "Docker Compose", duration: "35 min", free: false },
      { id: 5, title: "Docker Networking", duration: "25 min", free: false },
      { id: 6, title: "CI/CD with GitHub Actions", duration: "38 min", free: false },
      { id: 7, title: "Deploy to Server", duration: "32 min", free: false },
    ],
    notes: ["Docker Commands.pdf", "docker-compose Examples.yml", "Deployment Checklist.pdf"],
  },
  {
    id: 21,
    title: "Deep Learning & Neural Networks",
    description: "Build deep learning models with TensorFlow and Keras. CNNs, RNNs, NLP, image recognition, and production deployment.",
    category: "AI & ML",
    level: "Advanced",
    duration_minutes: 660,
    plan_required: "Enterprise",
    instructor: "Priya Singh",
    thumbnail: "🧠",
    lectures: [
      { id: 1, title: "Neural Network Basics", duration: "22 min", free: true },
      { id: 2, title: "TensorFlow & Keras Setup", duration: "20 min", free: false },
      { id: 3, title: "Convolutional Neural Networks", duration: "50 min", free: false },
      { id: 4, title: "Image Classification Project", duration: "45 min", free: false },
      { id: 5, title: "Recurrent Neural Networks", duration: "45 min", free: false },
      { id: 6, title: "NLP with Deep Learning", duration: "50 min", free: false },
      { id: 7, title: "Transfer Learning", duration: "38 min", free: false },
      { id: 8, title: "Model Deployment", duration: "42 min", free: false },
    ],
    notes: ["Deep Learning Concepts.pdf", "TensorFlow Cheatsheet.pdf", "Project Notebooks.zip"],
  },
  {
    id: 22,
    title: "Android App Development",
    description: "Build Android apps with Java and Kotlin. UI/UX, Activities, Fragments, APIs, Firebase, and publishing to Play Store.",
    category: "Mobile Development",
    level: "Intermediate",
    duration_minutes: 500,
    plan_required: "Professional",
    instructor: "Amit Verma",
    thumbnail: "📲",
    lectures: [
      { id: 1, title: "Android & Android Studio", duration: "18 min", free: true },
      { id: 2, title: "Kotlin Basics", duration: "30 min", free: false },
      { id: 3, title: "Activities & Intents", duration: "28 min", free: false },
      { id: 4, title: "UI Layouts & Views", duration: "32 min", free: false },
      { id: 5, title: "RecyclerView & Adapters", duration: "30 min", free: false },
      { id: 6, title: "REST APIs in Android", duration: "38 min", free: false },
      { id: 7, title: "Firebase Integration", duration: "35 min", free: false },
      { id: 8, title: "Play Store Publishing", duration: "25 min", free: false },
    ],
    notes: ["Android Development Guide.pdf", "Kotlin Cheatsheet.pdf", "Firebase Setup.pdf"],
  },
  {
    id: 23,
    title: "UI/UX Design with Figma",
    description: "Design beautiful user interfaces with Figma. Wireframes, prototyping, design systems, user research, and handoff.",
    category: "Design",
    level: "Intermediate",
    duration_minutes: 360,
    plan_required: "Professional",
    instructor: "Sneha Joshi",
    thumbnail: "🎯",
    lectures: [
      { id: 1, title: "UX Design Principles", duration: "18 min", free: true },
      { id: 2, title: "Figma Interface", duration: "20 min", free: false },
      { id: 3, title: "Wireframing", duration: "28 min", free: false },
      { id: 4, title: "Design Systems", duration: "32 min", free: false },
      { id: 5, title: "Prototyping", duration: "30 min", free: false },
      { id: 6, title: "User Research", duration: "28 min", free: false },
      { id: 7, title: "Developer Handoff", duration: "25 min", free: false },
    ],
    notes: ["UX Principles Guide.pdf", "Figma Components Kit.fig", "User Research Template.pdf"],
  },
  {
    id: 24,
    title: "E-commerce & Business Strategy",
    description: "Launch and scale an online business. Shopify, WooCommerce, dropshipping, product sourcing, and digital sales funnels.",
    category: "Digital Marketing",
    level: "Advanced",
    duration_minutes: 480,
    plan_required: "Enterprise",
    instructor: "Neha Gupta",
    thumbnail: "🛒",
    lectures: [
      { id: 1, title: "E-commerce Fundamentals", duration: "18 min", free: true },
      { id: 2, title: "Shopify Store Setup", duration: "35 min", free: false },
      { id: 3, title: "Product Sourcing", duration: "30 min", free: false },
      { id: 4, title: "Payment & Logistics", duration: "28 min", free: false },
      { id: 5, title: "Sales Funnels", duration: "35 min", free: false },
      { id: 6, title: "Facebook & Google Ads", duration: "40 min", free: false },
      { id: 7, title: "Customer Retention", duration: "30 min", free: false },
      { id: 8, title: "Scale & Automation", duration: "38 min", free: false },
    ],
    notes: ["E-commerce Checklist.pdf", "Product Research Template.xlsx", "Sales Funnel Blueprint.pdf"],
  },
  {
    id: 25,
    title: "Data Engineering & ETL Pipelines",
    description: "Build enterprise data pipelines. ETL, Apache Kafka, Spark basics, data warehousing, PostgreSQL, and cloud data storage.",
    category: "Data & Analytics",
    level: "Advanced",
    duration_minutes: 580,
    plan_required: "Enterprise",
    instructor: "Vikram Patel",
    thumbnail: "⚙️",
    lectures: [
      { id: 1, title: "Data Engineering Overview", duration: "20 min", free: true },
      { id: 2, title: "ETL Concepts & Tools", duration: "35 min", free: false },
      { id: 3, title: "Apache Kafka Basics", duration: "40 min", free: false },
      { id: 4, title: "PySpark Fundamentals", duration: "45 min", free: false },
      { id: 5, title: "Data Warehousing", duration: "38 min", free: false },
      { id: 6, title: "Cloud Data Storage (S3, GCS)", duration: "35 min", free: false },
      { id: 7, title: "Airflow & Scheduling", duration: "40 min", free: false },
      { id: 8, title: "End-to-End Pipeline Project", duration: "55 min", free: false },
    ],
    notes: ["ETL Pipeline Guide.pdf", "Kafka Setup.pdf", "Airflow DAGs Examples.zip"],
  },
];

const CATEGORIES = ["All", "Web Development", "Programming", "Digital Marketing", "Data & Analytics", "Design", "Database", "AI & ML", "Cloud & DevOps", "Cybersecurity", "Mobile Development"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const PLANS = ["All", "Starter", "Professional", "Enterprise"];

const planColor = { Starter: "bg-cyan-500", Professional: "bg-blue-600", Enterprise: "bg-purple-600" };
const levelColor = { Beginner: "text-green-400 bg-green-400/10", Intermediate: "text-yellow-400 bg-yellow-400/10", Advanced: "text-red-400 bg-red-400/10" };

const ClassesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [openCourse, setOpenCourse] = useState(null);
  const [loginModal, setLoginModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({ show: false, requiredPlan: "" });
  const [profile, setProfile] = useState(null);

  const { toast } = useToast();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.get(`${process.env.REACT_APP_API_BACKEND}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setProfile(res.data))
        .catch(() => {});
    }
  }, [token]);

  const filtered = COURSES.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchLevel = selectedLevel === "All" || c.level === selectedLevel;
    const matchPlan = selectedPlan === "All" || c.plan_required === selectedPlan;
    return matchSearch && matchCat && matchLevel && matchPlan;
  });

  const planHierarchy = { Starter: 1, Professional: 2, Enterprise: 3 };

  const handleEnroll = (course) => {
    if (!token) { setLoginModal(true); return; }
    const userPlanLevel = planHierarchy[profile?.data?.name] || 0;
    const coursePlanLevel = planHierarchy[course.plan_required] || 0;
    if (coursePlanLevel > userPlanLevel) {
      setUpgradeModal({ show: true, requiredPlan: course.plan_required });
      return;
    }
    toast({ title: "Enrolled!", description: `You are now enrolled in "${course.title}"` });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Explore Our <span className="text-primary">IT Courses</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              25 expert-led courses in Web Development, Digital Marketing, AI/ML, Cloud, Cybersecurity & more.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8 text-center">
            {[
              { label: "Courses", value: "25+" },
              { label: "Video Hours", value: "150+" },
              { label: "Instructors", value: "5" },
              { label: "Categories", value: "10" },
              { label: "Students", value: "2K+" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-lg p-3">
                <div className="text-xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {PLANS.map((p) => <option key={p} value={p}>{p === "All" ? "All Plans" : `${p} Plan`}</option>)}
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Course Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No courses match your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <Card key={course.id} className="border border-border hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                  {/* Card Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-3xl">{course.thumbnail}</span>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColor[course.level]}`}>
                          {course.level}
                        </span>
                        <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full ${planColor[course.plan_required]}`}>
                          {course.plan_required}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3 flex-1">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Play className="w-3 h-3" />{course.lectures.length} lectures</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_minutes} min</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{course.notes.length} notes</span>
                    </div>

                    <Badge variant="outline" className="w-fit text-xs">{course.category}</Badge>

                    <p className="text-xs text-muted-foreground">By {course.instructor}</p>

                    <div className="flex gap-2 mt-auto pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => setOpenCourse(openCourse?.id === course.id ? null : course)}
                      >
                        {openCourse?.id === course.id ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        Curriculum
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs gap-1"
                        onClick={() => handleEnroll(course)}
                      >
                        {!token && <Lock className="w-3 h-3" />}
                        Enroll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Course Detail Modal */}
      {openCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpenCourse(null)}>
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{openCourse.thumbnail}</span>
                <div>
                  <h2 className="font-bold text-foreground text-base">{openCourse.title}</h2>
                  <p className="text-xs text-muted-foreground">By {openCourse.instructor} · {openCourse.category}</p>
                </div>
              </div>
              <button onClick={() => setOpenCourse(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-sm text-muted-foreground">{openCourse.description}</p>

              <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${levelColor[openCourse.level]}`}>{openCourse.level}</span>
                <span className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${planColor[openCourse.plan_required]}`}>{openCourse.plan_required} Plan</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{openCourse.duration_minutes} min total</span>
              </div>

              {/* Video Lectures */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" />
                  Video Lectures ({openCourse.lectures.length})
                </h3>
                <div className="space-y-1.5">
                  {openCourse.lectures.map((lec, i) => (
                    <div
                      key={lec.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${
                        lec.free ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className={lec.free ? "text-foreground" : "text-muted-foreground"}>{lec.title}</span>
                        {lec.free && <Badge variant="outline" className="text-xs py-0 text-primary border-primary/30">Free Preview</Badge>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">{lec.duration}</span>
                        {lec.free
                          ? <Play className="w-4 h-4 text-primary cursor-pointer hover:scale-110 transition-transform" />
                          : <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Resources */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Notes & Resources ({openCourse.notes.length})
                </h3>
                <div className="space-y-1.5">
                  {openCourse.notes.map((note, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{note}</span>
                      <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2" onClick={() => { setOpenCourse(null); handleEnroll(openCourse); }}>
                {!token && <Lock className="w-4 h-4" />}
                Enroll in This Course
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 text-center mx-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6 text-sm">Sign in to enroll in this course and start learning.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setLoginModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => navigate(`/auth?redirect=${encodeURIComponent("/classes")}`)}>Sign In</Button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {upgradeModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 text-center mx-4">
            <h2 className="text-xl font-bold text-foreground mb-2">Plan Upgrade Required</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              This course requires the <strong className="text-primary">{upgradeModal.requiredPlan}</strong> plan.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setUpgradeModal({ show: false, requiredPlan: "" })}>Cancel</Button>
              <Button className="flex-1" onClick={() => navigate("/plans")}>View Plans</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ClassesPage;
