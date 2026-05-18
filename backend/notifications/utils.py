from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from email.mime.image import MIMEImage
from pathlib import Path


def send_html_email(subject, template, context, to):
    html_content = render_to_string(template, context)
    text_content = context.get("text_content", subject)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=to,
    )
    email.attach_alternative(html_content, "text/html")

    logo_path = Path(settings.BASE_DIR) / "static" / \
        "images" / "logo_DONEAT_FIN-01.png"

    if logo_path.exists():
        with open(logo_path, "rb") as f:
            img = MIMEImage(f.read())
            img.add_header("Content-ID", "<logo>")
            img.add_header("Content-Disposition", "inline",
                           filename="logo_DONEAT_FIN-01.png")
            email.attach(img)
    else:
        print("Logo not found:", logo_path)

    email.send(fail_silently=False)
