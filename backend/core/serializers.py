from rest_framework import serializers
from .models import Researcher, Paper, Book, Article, ContactMessage, GalleryItem, Notice


def absolute_media_url(request, value):
    """Return an absolute URL for a media file (handles ImageField/FileField)."""
    if not value:
        return None
    url = value.url if hasattr(value, "url") else value
    if request is not None and url.startswith("/"):
        return request.build_absolute_uri(url)
    return url


class AbsoluteURLField(serializers.Field):
    """Field that renders a media path as an absolute URL."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("required", False)
        kwargs.setdefault("allow_null", True)
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        request = self.context.get("request")
        return absolute_media_url(request, value)


class ResearcherSerializer(serializers.ModelSerializer):
    photo = AbsoluteURLField()

    class Meta:
        model = Researcher
        fields = "__all__"


class PaperSerializer(serializers.ModelSerializer):
    pdf = AbsoluteURLField()

    class Meta:
        model = Paper
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    cover = AbsoluteURLField()

    class Meta:
        model = Book
        fields = "__all__"


class ArticleSerializer(serializers.ModelSerializer):
    cover_url = AbsoluteURLField(source="cover", read_only=True)
    video_url = AbsoluteURLField(source="video", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "body",
            "cover",
            "video",
            "cover_url",
            "video_url",
            "published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["cover_url", "video_url", "created_at", "updated_at"]
        extra_kwargs = {
            "cover": {"required": False, "allow_null": True},
            "video": {"required": False, "allow_null": True},
        }


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ("is_read", "created_at")


class GalleryItemSerializer(serializers.ModelSerializer):
    file_url = AbsoluteURLField(source="file", read_only=True)
    thumbnail_url = AbsoluteURLField(source="thumbnail", read_only=True)

    class Meta:
        model = GalleryItem
        fields = "__all__"
        read_only_fields = ("file_url", "thumbnail_url", "created_at", "updated_at")
        extra_kwargs = {
            "file": {"required": False, "allow_null": True},
            "thumbnail": {"required": False, "allow_null": True},
        }
