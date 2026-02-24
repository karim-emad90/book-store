import React, { useEffect } from 'react';
import axios from 'axios';

const categories = [
    { name: "Business", slug: "business" },
    { name: "Self Help", slug: "self-help" },
    { name: "History", slug: "history" },
    { name: "Romance", slug: "romance" },
    { name: "Fantasy", slug: "fantasy" },
    { name: "Art", slug: "art" },
    { name: "Kids", slug: "kids" },
    { name: "Music", slug: "music" },
    { name: "Cooking", slug: "cooking" },
    { name: "Sports", slug: "sports" }
];

const createCategory = async (category) => {
    try {
        const response = await axios.post(
            'http://localhost:1337/api/categories',
            { data: category },
            {
                headers: {
                    Authorization: `Bearer YOUR_ADMIN_API_TOKEN`, // استبدل بـ API token
                    'Content-Type': 'application/json',
                }
            }
        );
        console.log(`Category created: ${category.name}`);
    } catch (error) {
        console.error('Error creating category:', error);
    }
};

const AddCategories = () => {
    useEffect(() => {
        // استدعاء دالة createCategory لكل فئة
        categories.forEach(createCategory);
    }, []);

    return (
        <div>
            <h1>Adding Categories</h1>
            <p>Categories are being added...</p>
        </div>
    );
};

export default AddCategories;
