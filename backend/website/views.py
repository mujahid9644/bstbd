from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from .models import Project, Enquiry
from .serializers import ProjectSerializer, EnquirySerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(published=True)
    serializer_class = ProjectSerializer
    lookup_field = 'slug'


class EnquiryViewSet(viewsets.GenericViewSet):
    serializer_class = EnquirySerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def submit(self, request):
        serializer = EnquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Thank you. Your enquiry has been received.'}, status=status.HTTP_201_CREATED)
