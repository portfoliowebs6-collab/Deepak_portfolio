const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Add a new project (Admin only)
router.post('/add', async (req, res) => {
    try {
        const { title, description, category, liveLink, githubLink, imageUrl } = req.body;
        
        const newProject = new Project({
            title,
            description,
            category,
            liveLink,
            githubLink,
            imageUrl
        });

        await newProject.save();
        res.status(201).json({ success: true, message: 'Project added successfully!', project: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
