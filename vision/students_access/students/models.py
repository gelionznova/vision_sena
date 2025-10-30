from django.db import models

# Create your models here.

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    training_program = models.CharField(max_length=100,default="NA")
    image = models.ImageField(upload_to='student_faces/')

    def __str__(self):
        return f"APRENDIZ {self.student_id} - {self.full_name}"

