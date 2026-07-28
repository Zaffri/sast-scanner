from rest_framework_simplejwt.authentication import JWTAuthentication


class HttpOnlyAuthentication(JWTAuthentication):
    def authenticate(self, request):

        header = self.get_header(request)
        access_token = None

        if header:
            access_token = self.get_raw_token(header)
        else:
            # support sent via cookie but keep default header approach above
            access_token = request.COOKIES.get("access_token")

        if access_token is None:
            return None

        validated_token = self.get_validated_token(access_token)

        return self.get_user(validated_token), validated_token
