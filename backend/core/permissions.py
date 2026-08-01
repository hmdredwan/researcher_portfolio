from functools import wraps
from django.http import JsonResponse
from .models import AdminUser


def get_admin_from_token(request):
    token = request.headers.get("Authorization", "")
    if token.startswith("Bearer "):
        token = token[len("Bearer "):].strip()
    if not token:
        return None
    try:
        return AdminUser.objects.get(token=token)
    except AdminUser.DoesNotExist:
        return None


def require_admin(view_func):
    """Decorator: ensures the request carries a valid admin bearer token."""

    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        admin = get_admin_from_token(request)
        if admin is None:
            return JsonResponse(
                {"detail": "Authentication credentials were not provided or invalid."},
                status=401,
            )
        request.admin_user = admin
        return view_func(request, *args, **kwargs)

    return _wrapped
