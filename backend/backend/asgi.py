import os
import chat.routing
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels_auth_token_middlewares.middleware import QueryStringSimpleJWTAuthTokenMiddleware, DRFAuthTokenMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
        "http": get_asgi_application(),
        'websocket': DRFAuthTokenMiddleware(
            QueryStringSimpleJWTAuthTokenMiddleware(
                URLRouter(
                        chat.routing.websocket_urlpatterns
                )
            )
        )
})
