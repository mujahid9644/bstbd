from rest_framework import serializers
from .models import Project, Enquiry


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'slug', 'location', 'status', 'description', 'featured_image', 'is_featured', 'created_at')


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ('name', 'email', 'phone', 'message')
