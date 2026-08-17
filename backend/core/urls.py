from django.urls import path
from . import views

urlpatterns = [
    # Public read-only API
    path("researcher/", views.public_researcher, name="public-researcher"),
    path("stats/", views.public_stats, name="public-stats"),
    path("papers/", views.public_paper_list, name="public-paper-list"),
    path("papers/<int:pk>/", views.public_paper_detail, name="public-paper-detail"),
    path("books/", views.public_book_list, name="public-book-list"),
    path("articles/", views.public_article_list, name="public-article-list"),
    path("articles/<slug:slug>/", views.public_article_detail, name="public-article-detail"),
    path("contact/", views.public_contact, name="public-contact"),
    path("notices/", views.public_notice_list, name="public-notices"),

    # Admin auth
    path("admin/login/", views.admin_login, name="admin-login"),
    path("admin/logout/", views.admin_logout, name="admin-logout"),

    # Admin profile
    path("admin/researcher/", views.admin_researcher, name="admin-researcher"),

    # Admin CRUD — papers
    path("admin/papers/", views.admin_paper_list, name="admin-paper-list"),
    path("admin/papers/<int:pk>/", views.admin_paper_detail, name="admin-paper-detail"),

    # Admin CRUD — books
    path("admin/books/", views.admin_book_list, name="admin-book-list"),
    path("admin/books/<int:pk>/", views.admin_book_detail, name="admin-book-detail"),

    # Admin CRUD — articles
    path("admin/articles/", views.admin_article_list, name="admin-article-list"),
    path("admin/articles/<int:pk>/", views.admin_article_detail, name="admin-article-detail"),

    # Admin notices
    path("admin/notices/", views.admin_notice_list, name="admin-notice-list"),
    path("admin/notices/<int:pk>/", views.admin_notice_detail, name="admin-notice-detail"),

    # Admin messages
    path("admin/messages/", views.admin_message_list, name="admin-message-list"),
    path("admin/messages/<int:pk>/", views.admin_message_detail, name="admin-message-detail"),

    # Public gallery
    path("gallery/", views.public_gallery_list, name="public-gallery-list"),

    # Admin gallery
    path("admin/gallery/", views.admin_gallery_list, name="admin-gallery-list"),
    path("admin/gallery/<int:pk>/", views.admin_gallery_detail, name="admin-gallery-detail"),
]
