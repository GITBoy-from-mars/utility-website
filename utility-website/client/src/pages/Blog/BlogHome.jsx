import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllPosts, getAllCategories, getRecentPosts } from '../../blog/_registry';
import siteConfig from '../../config/siteConfig';
import './Blog.css';

const BlogHome = () => {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(6);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let result = activeCategory === 'all' ? allPosts : allPosts.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    return result;
  }, [allPosts, activeCategory, searchQuery]);

  const featuredPost = recentPosts[0];

  return (
    <>
      <Helmet>
        <title>Blog - Tips, Guides &amp; Tutorials | {siteConfig.name}</title>
        <meta name="description" content="Read the latest tips, guides, and tutorials about file conversion, compression, productivity tools, and more." />
      </Helmet>

      <div className="blog-page container-lg">
        {/* Hero */}
        <div className="blog-hero">
          <h1 className="blog-hero-title">Blog</h1>
          <p className="blog-hero-desc">Tips, guides, and tutorials to help you get the most out of your tools</p>
        </div>

        {allPosts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">📝</div>
            <h2>No Posts Yet</h2>
            <p>Blog posts will appear here when you add HTML files to the <code>src/blog/posts/</code> directory.</p>
            <div className="blog-empty-instructions">
              <h3>How to Add a Blog Post:</h3>
              <ol>
                <li>Create a category folder: <code>src/blog/posts/converters/</code></li>
                <li>Add an HTML file: <code>my-first-post.html</code></li>
                <li>Include meta at the top of the file:<br />
                  <code>{`<!-- BLOG_META {"title":"My Post","excerpt":"Short description","date":"2026-05-16","author":"Admin"} -->`}</code>
                </li>
                <li>Write your blog content in HTML/CSS below the meta comment</li>
                <li>The post auto-appears on the blog!</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="blog-layout">
            {/* Main Content */}
            <div className="blog-main">
              {/* Featured Post */}
              {featuredPost && (
                <Link to={featuredPost.path} className="blog-featured">
                  {featuredPost.image && <div className="blog-featured-img" style={{ backgroundImage: `url(${featuredPost.image})` }} />}
                  <div className="blog-featured-content">
                    <span className="blog-badge">{featuredPost.categoryName}</span>
                    <h2 className="blog-featured-title">{featuredPost.title}</h2>
                    <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                    <div className="blog-post-meta">
                      <span>{featuredPost.author}</span>
                      <span className="blog-dot">·</span>
                      <time>{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                  </div>
                </Link>
              )}

              {/* Search + Category Filter */}
              <div className="blog-filters">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search posts..." className="blog-search" />
                <div className="blog-categories-bar">
                  <button className={`blog-cat-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>All ({allPosts.length})</button>
                  {categories.map(cat => (
                    <button key={cat.id} className={`blog-cat-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Grid */}
              <div className="blog-grid">
                {filteredPosts.map(post => (
                  <Link key={post.slug + post.category} to={post.path} className="blog-card">
                    {post.image ? <div className="blog-card-img" style={{ backgroundImage: `url(${post.image})` }} /> : <div className="blog-card-img blog-card-img-placeholder"><span>{post.title.charAt(0)}</span></div>}
                    <div className="blog-card-body">
                      <span className="blog-badge blog-badge-sm">{post.categoryName}</span>
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <div className="blog-post-meta">
                        <span>{post.author}</span>
                        <span className="blog-dot">·</span>
                        <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {filteredPosts.length === 0 && <p className="blog-no-results">No posts found matching your criteria.</p>}
            </div>

            {/* Sidebar */}
            <aside className="blog-sidebar">
              <div className="blog-sidebar-section">
                <h3 className="blog-sidebar-title">Categories</h3>
                <ul className="blog-sidebar-cats">
                  <li><button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All Posts <span>{allPosts.length}</span></button></li>
                  {categories.map(cat => (
                    <li key={cat.id}><button className={activeCategory === cat.id ? 'active' : ''} onClick={() => setActiveCategory(cat.id)}>{cat.name} <span>{cat.count}</span></button></li>
                  ))}
                </ul>
              </div>

              <div className="blog-sidebar-section">
                <h3 className="blog-sidebar-title">Recent Posts</h3>
                <div className="blog-sidebar-recent">
                  {recentPosts.slice(0, 4).map(post => (
                    <Link key={post.slug} to={post.path} className="blog-sidebar-post">
                      <span className="blog-sidebar-post-title">{post.title}</span>
                      <time className="blog-sidebar-post-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogHome;
