/* ========= GLOBALS ========= */
const { jsPDF } = window.jspdf;
const form = document.getElementById('resume-form');
const output = document.getElementById('resume-output');
const downloadBtn = document.getElementById('download-pdf');
const printBtn = document.getElementById('print-resume');
let photoDataURL = ''; // Stores the uploaded photo for reuse in PDF

/* ========= FORM SUBMIT ========= */
form.addEventListener('submit', e => {
    e.preventDefault();
    
    /* ---- Collect values ---- */
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const linkedin = form.linkedin.value.trim();
    const github = form.github.value.trim();
    const summary = form.summary.value.trim();
    const achievements = form.achievements.value.trim();
    const languages = form.languages.value.trim();
    const education = form.education.value.trim();
    const courses = form.courses.value.trim();
    const projects = form.projects.value.trim();
    const projectDescription = form['project-description'].value.trim();
    const skills = form.skills.value.trim();
    const photoFile = document.getElementById('photo').files[0];
    
    /* ---- Basic validation ---- */
    if (!name || !email || !phone || !summary || !education) {
        alert("Please fill all required fields.");
        return;
    }
    
    /* ---- Build HTML preview ---- */
    let html = `<h2>${name}</h2>`;
    
    // Add photo if uploaded
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoDataURL = e.target.result;
            html = `<img src="${photoDataURL}" alt="Profile Photo">${html}`;
            finishGeneratingResume();
        };
        reader.readAsDataURL(photoFile);
    } else {
        finishGeneratingResume();
    }
    
    function finishGeneratingResume() {
        html += `<p><strong>Email:</strong> ${email}</p>`;
        html += `<p><strong>Phone:</strong> ${phone}</p>`;
        
        if (linkedin) {
            html += `<p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>`;
        }
        
        if (github) {
            html += `<p><strong>GitHub:</strong> <a href="${github}" target="_blank">${github}</a></p>`;
        }
        
        html += `<h3>Professional Summary</h3><p>${summary}</p>`;
        
        if (achievements) {
            html += `<h3>Achievements</h3><p>${achievements.replace(/\n/g, "<br>")}</p>`;
        }
        
        if (languages) {
            html += `<h3>Languages</h3><p>${languages}</p>`;
        }
        
        html += `<h3>Education</h3><p>${education.replace(/\n/g, "<br>")}</p>`;
        
        if (courses) {
            html += `<h3>Courses/Certifications</h3><p>${courses.replace(/\n/g, "<br>")}</p>`;
        }
        
        if (projects) {
            html += `<h3>Projects</h3><p>${projects.replace(/\n/g, "<br>")}</p>`;
        }
        
        if (projectDescription) {
            html += `<h3>Project Descriptions</h3><p>${projectDescription.replace(/\n/g, "<br>")}</p>`;
        }
        
        if (skills) {
            html += `<h3>Skills</h3><p>${skills.replace(/\n/g, "<br>")}</p>`;
        }
        
        /* ---- Display preview ---- */
        document.getElementById('resume-preview').innerHTML = html;
        output.style.display = 'block';
        downloadBtn.disabled = false;
        printBtn.disabled = false;
    }
});

/* ========= PDF DOWNLOAD ========= */
downloadBtn.addEventListener('click', () => {
    const doc = new jsPDF();
    const name = form.name.value.trim();
    
    // Set up fonts and positioning
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 7;
    
    // Add photo if available
    if (photoDataURL) {
        try {
            doc.addImage(photoDataURL, 'JPEG', pageWidth - 60, 10, 40, 40);
        } catch (e) {
            console.warn('Could not add image to PDF:', e);
        }
    }
    
    // Name (title)
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text(name, margin, yPosition);
    yPosition += 15;
    
    // Contact info
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text(`Email: ${form.email.value}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Phone: ${form.phone.value}`, margin, yPosition);
    yPosition += lineHeight;
    
    if (form.linkedin.value) {
        doc.text(`LinkedIn: ${form.linkedin.value}`, margin, yPosition);
        yPosition += lineHeight;
    }
    
    if (form.github.value) {
        doc.text(`GitHub: ${form.github.value}`, margin, yPosition);
        yPosition += lineHeight;
    }
    
    yPosition += 5;
    
    // Helper function to add sections
    function addSection(title, content) {
        if (!content) return;
        
        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text(title, margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(11);
        doc.setFont('times', 'normal');
        
        const lines = doc.splitTextToSize(content, pageWidth - 2 * margin);
        lines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, margin, yPosition);
            yPosition += 6;
        });
        yPosition += 3;
    }
    
    // Add all sections
    addSection('Professional Summary', form.summary.value);
    addSection('Achievements', form.achievements.value);
    addSection('Languages', form.languages.value);
    addSection('Education', form.education.value);
    addSection('Courses/Certifications', form.courses.value);
    addSection('Projects', form.projects.value);
    addSection('Project Descriptions', form['project-description'].value);
    addSection('Skills', form.skills.value);
    
    // Save the PDF
    doc.save(`${name}_Resume.pdf`);
});

/* ========= PRINT RESUME ========= */
printBtn.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    const resumeContent = document.getElementById('resume-preview').innerHTML;
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Resume - ${form.name.value}</title>
            <style>
                body { font-family: Georgia, serif; margin: 40px; line-height: 1.6; }
                h2 { color: #0078d7; border-bottom: 2px solid #0078d7; padding-bottom: 5px; }
                h3 { color: #0078d7; border-bottom: 1px solid #bbb; padding-bottom: 3px; margin-top: 25px; }
                img { float: right; max-width: 120px; border-radius: 10px; margin-left: 20px; }
                a { color: #0078d7; text-decoration: none; }
            </style>
        </head>
        <body>
            ${resumeContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
});
