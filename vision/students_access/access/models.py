from django.db import models

# Create your models here.

class AccessRecord(models.Model):
    student_id = models.CharField(max_length=20)
    date = models.DateField(auto_now_add=True)
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)
    photo = models.ImageField(upload_to='access_photos/', null=True, blank=True)

    def __str__(self):
        return f"Acceso de {self.student_id} - {self.date}"

