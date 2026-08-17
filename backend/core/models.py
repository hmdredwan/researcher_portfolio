from django.db import models
import secrets


class AdminUser(models.Model):
    """Single-panel login for the custom admin (front-end) panel.

    Uses Django's password hashing via ``set_password``/``check_password`` so
    credentials are never stored in plain text.
    """

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # hashed
    token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def generate_token(self):
        self.token = secrets.token_urlsafe(32)
        self.save(update_fields=["token"])
        return self.token

    def __str__(self):
        return self.username


class Researcher(models.Model):
    """Singleton-style profile describing the researcher."""

    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    tagline = models.CharField(max_length=300, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="profile/", blank=True, null=True)
    email = models.EmailField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    scholar_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Paper(models.Model):
    title = models.CharField(max_length=400)
    authors = models.CharField(max_length=400)
    abstract = models.TextField(blank=True)
    year = models.IntegerField()
    venue = models.CharField(max_length=300, blank=True)
    doi = models.CharField(max_length=200, blank=True)
    pdf = models.FileField(upload_to="papers/", blank=True, null=True)
    tags = models.CharField(max_length=300, blank=True, help_text="Comma-separated")
    published = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-created_at"]

    def __str__(self):
        return self.title

    def tag_list(self):
        return [t.strip() for t in self.tags.split(",") if t.strip()]


class Book(models.Model):
    title = models.CharField(max_length=400)
    authors = models.CharField(max_length=400)
    description = models.TextField(blank=True)
    year = models.IntegerField()
    publisher = models.CharField(max_length=300, blank=True)
    cover = models.ImageField(upload_to="covers/", blank=True, null=True)
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-created_at"]

    def __str__(self):
        return self.title


class Article(models.Model):
    title = models.CharField(max_length=400)
    slug = models.SlugField(max_length=400, unique=True)
    excerpt = models.CharField(max_length=500, blank=True)
    body = models.TextField(blank=True)
    cover = models.ImageField(upload_to="covers/", blank=True, null=True)
    video = models.FileField(upload_to="articles/videos/", blank=True, null=True)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class GalleryItem(models.Model):
    VIDEO = "video"
    SHORT = "short"
    IMAGE = "image"
    CATEGORY_CHOICES = [
        (VIDEO, "Video"),
        (SHORT, "Short"),
        (IMAGE, "Image"),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=400, blank=True)
    caption = models.TextField(blank=True)
    youtube_url = models.URLField(blank=True)
    file = models.FileField(upload_to="gallery/", blank=True, null=True)
    thumbnail = models.ImageField(upload_to="gallery/thumbs/", blank=True, null=True)
    order = models.IntegerField(default=0)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.get_category_display()}: {self.title or self.pk}"


class Notice(models.Model):
    text = models.CharField(max_length=220)
    link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.text[:80]


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject or '(no subject)'}"
