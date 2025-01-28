from flask import Flask, jsonify
import os
from pathlib import Path

app = Flask(__name__)

# Sample data
lessons = [
    {"id": 1, "title": "Lesson 1", "content": "Content of Lesson 1"},
    {"id": 2, "title": "Lesson 2", "content": "Content of Lesson 2"},
    {"id": 3, "title": "Lesson 3", "content": "Content of Lesson 3"}
]

def load_lessons_from_directory(directory):
    lessons = []
    lesson_id = 1
    for path in Path(directory).rglob('*.md'):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            relative_path = os.path.relpath(path, directory)
            lessons.append({
                "id": lesson_id,
                "title": path.stem,
                "path": str(relative_path),
                "content": content
            })
            lesson_id += 1
    return lessons

lessons = load_lessons_from_directory('lessons')

from flask import request

@app.route('/api/lessons', methods=['GET'])
def get_lessons():
    return jsonify(lessons)

@app.route('/api/lessons/<int:lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    updated_data = request.json
    for lesson in lessons:
        if lesson['id'] == lesson_id:
            lesson.update(updated_data)
            return jsonify(lesson), 200
    return jsonify({'error': 'Lesson not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)