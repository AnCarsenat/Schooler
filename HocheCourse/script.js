document.addEventListener("DOMContentLoaded", () => {
    const lessonTree = document.getElementById('lessonTree');
    const lessonViewport = document.getElementById('lessonViewport');

    // Fetch lessons from backend
    function fetchLessons(subject) {
        fetch(`/lessons/${subject}`)
            .then(response => response.json())
            .then(data => {
                generateLessonTree(data);
            });
    }

    // Generate the tree structure for lessons
    function generateLessonTree(lessons) {
        lessonTree.innerHTML = '';
        for (const lesson in lessons) {
            const lessonItem = document.createElement('li');
            lessonItem.textContent = lesson;
            const subList = document.createElement('ul');
            lessons[lesson].forEach(section => {
                const sectionItem = document.createElement('li');
                sectionItem.textContent = section;
                sectionItem.addEventListener('click', () => loadLessonContent(lesson, section));
                subList.appendChild(sectionItem);
            });
            lessonItem.appendChild(subList);
            lessonTree.appendChild(lessonItem);
        }
    }

    // Load lesson content from backend
    function loadLessonContent(lesson, section) {
        fetch(`/lesson/francais/${lesson}/${section}`)
            .then(response => response.json())
            .then(data => {
                lessonViewport.innerHTML = `<h1>${lesson} - ${section}</h1><p>${data.content}</p>`;
            });
    }

    // Example to load "francais" lessons initially
    fetchLessons('francais');
});
