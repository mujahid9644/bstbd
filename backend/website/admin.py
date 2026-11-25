from django.contrib import admin
from .models import Project, Enquiry


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'status', 'published', 'is_featured', 'order')
    list_filter = ('published', 'is_featured', 'status')
    search_fields = ('title', 'location')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    readonly_fields = ('created_at',)
