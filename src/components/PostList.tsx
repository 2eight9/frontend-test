import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PostCard from './PostCard';
import { fetchPosts } from '../services/api';

interface Post {
  id: string;
  title: string;
  small_image: string;
  medium_image: string;
  published_at: string;
}

interface PostListProps {}

const PostList: React.FC<PostListProps> = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('-published_at');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSizeOptions = [10, 20, 50];
  const sortOptions = [
    { value: '-published_at', label: 'Newest' },
    { value: 'published_at', label: 'Oldest' }
  ];

  // Load posts from API
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchPosts({
        page: currentPage,
        pageSize,
        sort: sortOrder
      });
      
      setPosts(response.data);
      setTotalPages(Math.ceil(response.meta.total / pageSize));
      setTotalItems(response.meta.total);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortOrder]);

  // Load posts when dependencies change
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Save state to URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    params.set('sort', sortOrder);
    
    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [currentPage, pageSize, sortOrder]);

  // Load state from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page') || '1');
    const size = parseInt(urlParams.get('size') || '10');
    const sort = urlParams.get('sort') || '-published_at';
    
    setCurrentPage(page);
    setPageSize(size);
    setSortOrder(sort);
  }, []);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    
    return (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
        <div className="text-gray-600">
          Showing {startItem} - {endItem} of {totalItems}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
            const pageNum = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
            if (pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 rounded-lg border ${
                  pageNum === currentPage
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-gray-600">
            Showing {posts.length} of {totalItems} posts
          </div>
          
          <div className="flex items-center gap-4">
            {/* Show per page */}
            <div className="flex items-center gap-2">
              <label className="text-gray-600 text-sm">Show per page:</label>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            {/* Sort by */}
            <div className="flex items-center gap-2">
              <label className="text-gray-600 text-sm">Sort by:</label>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }, (_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadPosts}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                small_image={post.small_image}
                medium_image={post.medium_image}
                published_at={post.published_at}
              />
            ))}
          </div>
        )}

        {/* No posts */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts found.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && posts.length > 0 && renderPagination()}
      </div>
    </section>
  );
};

export default PostList;