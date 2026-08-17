import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, Http404

from .models import Researcher, Paper, Book, Article, ContactMessage, GalleryItem, Notice
from .serializers import (
    ResearcherSerializer,
    PaperSerializer,
    BookSerializer,
    ArticleSerializer,
    ContactMessageSerializer,
    GalleryItemSerializer,
    NoticeSerializer,
)
from .permissions import require_admin


def _json(data, status=200):
    return JsonResponse(data, status=status, safe=False)


def _body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return {}


def _crud_payload(request, serializer_class, obj=None, partial=False):
    """Build serializer from request data and files, returning (instance, response_or_None)."""
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        request._load_post_and_files()
        data = request.POST.dict()
        data.update(request.FILES.dict())
        serializer = serializer_class(
            data=data,
            instance=obj,
            partial=partial,
            context={"request": request},
        )
    else:
        data = _body(request)
        serializer = serializer_class(data=data, instance=obj, partial=partial, context={"request": request})
    if not serializer.is_valid():
        return None, _json(serializer.errors, status=400)
    serializer.save()
    return serializer.instance, None


# ---------------------------------------------------------------- public API


@require_http_methods(["GET"])
def public_researcher(request):
    profile = Researcher.objects.first()
    if not profile:
        return _json({})
    return _json(ResearcherSerializer(profile, context={"request": request}).data)


@require_http_methods(["GET"])
def public_paper_list(request):
    qs = Paper.objects.filter(published=True)
    return _json(PaperSerializer(qs, many=True, context={"request": request}).data)


@require_http_methods(["GET"])
def public_paper_detail(request, pk):
    try:
        obj = Paper.objects.get(pk=pk, published=True)
    except Paper.DoesNotExist:
        raise Http404
    return _json(PaperSerializer(obj, context={"request": request}).data)


@require_http_methods(["GET"])
def public_book_list(request):
    qs = Book.objects.all()
    return _json(BookSerializer(qs, many=True, context={"request": request}).data)


@require_http_methods(["GET"])
def public_article_list(request):
    qs = Article.objects.filter(published=True)
    return _json(ArticleSerializer(qs, many=True, context={"request": request}).data)


@require_http_methods(["GET"])
def public_article_detail(request, slug):
    try:
        obj = Article.objects.get(slug=slug, published=True)
    except Article.DoesNotExist:
        raise Http404
    return _json(ArticleSerializer(obj, context={"request": request}).data)


@csrf_exempt
@require_http_methods(["POST"])
def public_contact(request):
    data = _body(request)
    required = ["name", "email", "message"]
    if not all(data.get(f) for f in required):
        return _json({"detail": "Missing required fields: name, email, message."}, status=400)
    msg = ContactMessage.objects.create(
        name=data["name"][:200],
        email=data["email"][:254],
        subject=(data.get("subject") or "")[:300],
        message=data["message"],
    )
    return _json(ContactMessageSerializer(msg).data, status=201)


@require_http_methods(["GET"])
def public_stats(request):
    return _json({
        "papers": Paper.objects.filter(published=True).count(),
        "books": Book.objects.count(),
        "articles": Article.objects.filter(published=True).count(),
        "messages_unread": ContactMessage.objects.filter(is_read=False).count(),
        "gallery": GalleryItem.objects.count(),
    })


# ---------------------------------------------------------------- admin auth


@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request):
    from .models import AdminUser
    data = _body(request)
    username = data.get("username", "")
    password = data.get("password", "")
    try:
        admin = AdminUser.objects.get(username=username)
    except AdminUser.DoesNotExist:
        return _json({"detail": "Invalid credentials."}, status=401)
    if not admin.check_password(password):
        return _json({"detail": "Invalid credentials."}, status=401)
    token = admin.generate_token()
    return _json({
        "token": token,
        "admin": {"username": admin.username, "email": admin.email},
    })


@csrf_exempt
@require_http_methods(["POST"])
@require_admin
def admin_logout(request):
    admin = request.admin_user
    admin.token = None
    admin.save(update_fields=["token"])
    return _json({"detail": "Logged out."})


# ---------------------------------------------------------------- admin CRUD


@csrf_exempt
@require_http_methods(["GET", "PUT"])
@require_admin
def admin_researcher(request):
    profile = Researcher.objects.first()
    if request.method == "GET":
        if not profile:
            return _json({})
        return _json(ResearcherSerializer(profile, context={"request": request}).data)
    # PUT — create or update the singleton profile
    data = _body(request)
    if profile:
        serializer = ResearcherSerializer(data=data, instance=profile, partial=True)
    else:
        serializer = ResearcherSerializer(data=data)
    if not serializer.is_valid():
        return _json(serializer.errors, status=400)
    serializer.save()
    return _json(ResearcherSerializer(serializer.instance, context={"request": request}).data)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@require_admin
def admin_paper_list(request):
    if request.method == "GET":
        qs = Paper.objects.all()
        return _json(PaperSerializer(qs, many=True, context={"request": request}).data)
    obj, err = _crud_payload(request, PaperSerializer)
    if err:
        return err
    return _json(PaperSerializer(obj, context={"request": request}).data, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
@require_admin
def admin_paper_detail(request, pk):
    try:
        obj = Paper.objects.get(pk=pk)
    except Paper.DoesNotExist:
        raise Http404
    if request.method == "GET":
        return _json(PaperSerializer(obj, context={"request": request}).data)
    if request.method == "DELETE":
        obj.delete()
        return _json({"detail": "Deleted."})
    obj, err = _crud_payload(request, PaperSerializer, obj=obj, partial=True)
    if err:
        return err
    return _json(PaperSerializer(obj, context={"request": request}).data)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@require_admin
def admin_book_list(request):
    if request.method == "GET":
        qs = Book.objects.all()
        return _json(BookSerializer(qs, many=True, context={"request": request}).data)
    obj, err = _crud_payload(request, BookSerializer)
    if err:
        return err
    return _json(BookSerializer(obj, context={"request": request}).data, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
@require_admin
def admin_book_detail(request, pk):
    try:
        obj = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        raise Http404
    if request.method == "GET":
        return _json(BookSerializer(obj, context={"request": request}).data)
    if request.method == "DELETE":
        obj.delete()
        return _json({"detail": "Deleted."})
    obj, err = _crud_payload(request, BookSerializer, obj=obj, partial=True)
    if err:
        return err
    return _json(BookSerializer(obj, context={"request": request}).data)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@require_admin
def admin_article_list(request):
    if request.method == "GET":
        qs = Article.objects.all()
        return _json(ArticleSerializer(qs, many=True, context={"request": request}).data)
    try:
        obj, err = _crud_payload(request, ArticleSerializer)
        if err:
            return err
        return _json(ArticleSerializer(obj, context={"request": request}).data, status=201)
    except Exception as exc:
        return _json({"detail": str(exc), "type": type(exc).__name__}, status=500)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
@require_admin
def admin_article_detail(request, pk):
    try:
        obj = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        raise Http404
    if request.method == "GET":
        return _json(ArticleSerializer(obj, context={"request": request}).data)
    if request.method == "DELETE":
        obj.delete()
        return _json({"detail": "Deleted."})
    try:
        obj, err = _crud_payload(request, ArticleSerializer, obj=obj, partial=True)
        if err:
            return err
        return _json(ArticleSerializer(obj, context={"request": request}).data)
    except Exception as exc:
        return _json({"detail": str(exc), "type": exc.__class__.__name__}, status=500)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@require_admin
def admin_notice_list(request):
    if request.method == "GET":
        qs = Notice.objects.all()
        return _json(NoticeSerializer(qs, many=True).data)
    obj, err = _crud_payload(request, NoticeSerializer)
    if err:
        return err
    return _json(NoticeSerializer(obj).data, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
@require_admin
def admin_notice_detail(request, pk):
    try:
        obj = Notice.objects.get(pk=pk)
    except Notice.DoesNotExist:
        raise Http404
    if request.method == "GET":
        return _json(NoticeSerializer(obj).data)
    if request.method == "DELETE":
        obj.delete()
        return _json({"detail": "Deleted."})
    obj, err = _crud_payload(request, NoticeSerializer, obj=obj, partial=True)
    if err:
        return err
    return _json(NoticeSerializer(obj).data)


@csrf_exempt
@require_http_methods(["GET"])
@require_admin
def admin_message_list(request):
    qs = ContactMessage.objects.all()
    return _json(ContactMessageSerializer(qs, many=True).data)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
@require_admin
def admin_message_detail(request, pk):
    try:
        obj = ContactMessage.objects.get(pk=pk)
    except ContactMessage.DoesNotExist:
        raise Http404
    if request.method == "DELETE":
        obj.delete()
        return _json({"detail": "Deleted."})
    if request.method == "PUT":
        data = _body(request)
        if "is_read" in data:
            obj.is_read = bool(data["is_read"])
            obj.save(update_fields=["is_read"])
    return _json(ContactMessageSerializer(obj).data)


# ---------------------------------------------------------------- gallery


@require_http_methods(["GET"])
def public_notice_list(request):
    qs = Notice.objects.filter(is_active=True)[:8]
    return _json(NoticeSerializer(qs, many=True).data)


@require_http_methods(["GET"])
def public_gallery_list(request):
    qs = GalleryItem.objects.filter(published=True)
    category = request.GET.get("category")
    valid_categories = dict(GalleryItem.CATEGORY_CHOICES).keys()
    if category in valid_categories:
        qs = qs.filter(category=category)
    return _json(GalleryItemSerializer(qs, many=True, context={"request": request}).data)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@require_admin
def admin_gallery_list(request):
    if request.method == "GET":
        qs = GalleryItem.objects.all()
        return _json(GalleryItemSerializer(qs, many=True, context={"request": request}).data)
    obj, err = _crud_payload(request, GalleryItemSerializer)
    if err:
        return err
    return _json(GalleryItemSerializer(obj, context={"request": request}).data, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
@require_admin
def admin_gallery_detail(request, pk):
    try:
        obj = GalleryItem.objects.get(pk=pk)
    except GalleryItem.DoesNotExist:
        raise Http404
    if request.method == "GET":
        return _json(GalleryItemSerializer(obj, context={"request": request}).data)
    if request.method == "DELETE":
        obj.delete()
        return _json({"detail": "Deleted."})
    obj, err = _crud_payload(request, GalleryItemSerializer, obj=obj, partial=True)
    if err:
        return err
    return _json(GalleryItemSerializer(obj, context={"request": request}).data)
