
# Question Forge Studio

A comprehensive application for creating, managing, and exporting quiz questions in XML format. Question Forge Studio supports two types of questions:

1. **Fastest Finger First Questions**: These questions ask contestants to arrange four items in a specific order.
2. **Regular Questions**: Standard multiple-choice questions with one correct answer.

## Features

- Create and edit both question types with an intuitive interface
- Organize questions by type in separate lists
- Select which questions to include in your export
- Export questions in a standardized XML format
- Built with React, TypeScript, and Tailwind CSS

## Usage

### Creating Questions

1. Navigate to the appropriate tab (Fastest Finger or Regular Questions)
2. Click "Add Question"
3. Fill in the form with your question details
4. Click "Add Question" to save

### Managing Questions

- View all your questions in the list view
- Edit any question by clicking the edit icon
- Delete questions with the trash icon
- Select questions for export by checking the checkbox

### Exporting Questions

1. Select the questions you want to include by checking the checkboxes
   - For Fastest Finger First, only one question can be selected
   - For Regular Questions, you can select multiple
2. Go to the Export tab
3. Review your selections
4. Click "Export to XML" to download the file

## XML Format

The exported XML follows this structure:

```xml
<questions>
  <fastest difficulty="0">
    <text>Your fastest finger question text</text>
    <a>Option A</a>
    <b>Option B</b>
    <c>Option C</c>
    <d>Option D</d>
    <correctOrder>
      <one>a</one>
      <two>b</two>
      <three>c</three>
      <four>d</four>
    </correctOrder>
  </fastest>
  <question>
    <category>Your Category</category>
    <text>Your question text</text>
    <a correct="yes/no">Option A</a>
    <b correct="yes/no">Option B</b>
    <c correct="yes/no">Option C</c>
    <d correct="yes/no">Option D</d>
  </question>
  <!-- Additional questions follow the same format -->
</questions>
```

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser to the displayed URL

## License

MIT
