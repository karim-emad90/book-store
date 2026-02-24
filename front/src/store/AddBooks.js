import React, { useEffect } from 'react';
import axios from 'axios';

const books = [
    {
        title: "Sacred Startup",
        slug: "business-book-001",
        description: "Packed with practical examples and simple explanations...",
        author: "Mona Kiyosaki",
        publisher: "Riverstone",
        year: 2007,
        price: 14.99,
        isbn13: "9780013389088",
        category: { name: "Business", slug: "business" }
    },
    // Add more books here
];

const createBook = async (book) => {
    try {
        // الحصول على صورة من Unsplash باستخدام عنوان الكتاب أو الفئة
        const imageUrl = await getImageFromUnsplash(book.title || book.category.name);
        
        const categoryResponse = await axios.get(
            `http://localhost:1337/api/categories?filters[slug][$eq]=${book.category.slug}`,
            {
                headers: {
                    Authorization: `Bearer YOUR_ADMIN_API_TOKEN`,
                }
            }
        );
        const categoryId = categoryResponse.data.data[0].id;
        
        const response = await axios.post(
            'http://localhost:1337/api/books',
            {
                data: {
                    title: book.title,
                    slug: book.slug,
                    description: book.description,
                    author: book.author,
                    publisher: book.publisher,
                    year: book.year,
                    price: book.price,
                    isbn13: book.isbn13,
                    category: categoryId,
                    coverImageUrl: imageUrl || 'default_image_url',  // استخدام صورة افتراضية إذا لم توجد
                }
            },
            {
                headers: {
                    Authorization: `Bearer YOUR_ADMIN_API_TOKEN`,
                }
            }
        );
        console.log(`Book created: ${book.title}`);
    } catch (error) {
        console.error('Error creating book:', error);
    }
};

const getImageFromUnsplash = async (searchQuery) => {
    try {
        const response = await axios.get(
            `https://api.unsplash.com/photos/random`,
            {
                params: {
                    query: searchQuery,  // نبحث عن الصورة باستخدام عنوان الكتاب أو الفئة
                    client_id: 'YOUR_UNSPLASH_API_KEY',
                    per_page: 1,
                }
            }
        );
        return response.data[0]?.urls?.regular;
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return null;
    }
};

const AddBooks = () => {
    useEffect(() => {
        // استدعاء دالة createBook لكل كتاب
        books.forEach(createBook);
    }, []);

    return (
        <div>
            <h1>Adding Books</h1>
            <p>Books are being added...</p>
        </div>
    );
};

export default AddBooks;
