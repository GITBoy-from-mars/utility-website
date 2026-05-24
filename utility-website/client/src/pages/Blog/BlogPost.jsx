import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../../components/common/SEOHead';
import { getPostBySlug, getPostsByCategory, getRecentPosts, getAllCategories } from '../../blog/_registry';
import siteConfig from '../../config/siteConfig';
import './Blog.css';

const API = import.meta.env.VITE_API_URL || '';

const BlogPost = () => {
  const { category, slug } = useParams();
  const post = getPostBySlug(category, slug);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [posting, setPosting] = useState(false);

  // Load comments from server
  useEffect(() => {
    if (!category || !slug) return;
    fetch(`${API}/api/blog-comments/${category}/${slug}`)
      .then(r => r.json())
      .then(d => { if (d.success) setComments(d.comments); })
      .catch(() => {});
  }, [category, slug]);

  if (!post) return (
    <div className="blog-page container-lg" style={{ textAlign: 'center', padding: '80px 0' }}>
      <h1>Post Not Found</h1>
      <p style={{ color: 'var(--neutral-500)', margin: '12px 0 24px' }}>The blog post you're looking for doesn't exist.</p>
      <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
    </div>
  );

  const relatedPosts = getPostsByCategory(category).filter(p => p.slug !== slug).slice(0, 3);
  const recentPosts = getRecentPosts(5).filter(p => p.slug !== slug).slice(0, 4);
  const categories = getAllCategories();

  const blogJsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.url}${post.path}` },
    ...(post.image && { image: `${siteConfig.url}${post.image}` }),
    ...(post.keywords && { keywords: post.keywords }),
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`${API}/api/blog-comments/${category}/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: commentName, email: commentEmail, text: commentText }),
      });
      const data = await res.json();
      if (data.success) { setComments(prev => [...prev, data.comment]); setCommentName(''); setCommentEmail(''); setCommentText(''); }
    } catch { /* silently fail */ }
    setPosting(false);
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | ${siteConfig.name} Blog`}
        description={post.description || post.excerpt}
        slug={post.path}
        keywords={post.keywords}
        image={post.image}
        type="article"
      />
      {post.focusKeyword && <meta name="focus-keyword" content={post.focusKeyword} />}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogJsonLd)}</script>
      </Helmet>

      <div className="blog-page container-lg">
        <div className="blog-layout">
          <article className="blog-article">
            <nav className="blog-breadcrumb">
              <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / <Link to={`/blog?cat=${post.category}`}>{post.categoryName}</Link> / <span>{post.title}</span>
            </nav>

            <header className="blog-article-header">
              <span className="blog-badge">{post.categoryName}</span>
              <h1 className="blog-article-title">{post.title}</h1>
              <div className="blog-post-meta" style={{ fontSize: '0.875rem' }}>
                <span>{post.author}</span>
                <span className="blog-dot">·</span>
                <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
            </header>

            {post.image && <img src={post.image} alt={post.title} className="blog-article-img" />}

            <div className="blog-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.tags.length > 0 && (
              <div className="blog-tags">
                {post.tags.map(tag => <span key={tag} className="blog-tag">{tag}</span>)}
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="blog-related">
                <h3 className="blog-related-title">Related Posts in {post.categoryName}</h3>
                <div className="blog-related-grid">
                  {relatedPosts.map(rp => (
                    <Link key={rp.slug} to={rp.path} className="blog-related-card">
                      <h4>{rp.title}</h4>
                      <time>{new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="blog-comments">
              <h3 className="blog-comments-title">Comments ({comments.length})</h3>
              {comments.map((c) => (
                <div key={c.id || c.date} className="blog-comment">
                  <div className="blog-comment-avatar">{c.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{c.name}</strong>
                    <time>{new Date(c.date).toLocaleDateString()}</time>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
              <form onSubmit={addComment} className="blog-comment-form">
                <h4>Leave a Comment</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={commentName} onChange={e => setCommentName(e.target.value)} placeholder="Your name *" required className="blog-comment-input" style={{ flex: 1 }} />
                  <input value={commentEmail} onChange={e => setCommentEmail(e.target.value)} placeholder="Your email *" type="email" required className="blog-comment-input" style={{ flex: 1 }} />
                </div>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write your comment..." required rows={3} className="blog-comment-input" />
                <button type="submit" className="btn btn-primary" disabled={posting}>{posting ? 'Posting...' : 'Post Comment'}</button>
              </form>
            </div>
          </article>

          <aside className="blog-sidebar">
            <div className="blog-sidebar-section">
              <h3 className="blog-sidebar-title">Categories</h3>
              <ul className="blog-sidebar-cats">
                {categories.map(cat => (
                  <li key={cat.id}><Link to={`/blog?cat=${cat.id}`}>{cat.name} <span>{cat.count}</span></Link></li>
                ))}
              </ul>
            </div>
            <div className="blog-sidebar-section">
              <h3 className="blog-sidebar-title">Recent Posts</h3>
              <div className="blog-sidebar-recent">
                {recentPosts.map(rp => (
                  <Link key={rp.slug} to={rp.path} className="blog-sidebar-post">
                    <span className="blog-sidebar-post-title">{rp.title}</span>
                    <time className="blog-sidebar-post-date">{new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
