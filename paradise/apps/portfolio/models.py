from django.db import models



class Portfolio(models.Model):
	ordering = models.IntegerField(default=0)
	name = models.CharField(max_length=256)
	image = models.ImageField(upload_to='uploads/portfolio', blank=True, null=True)

	class Meta:
		ordering = ('ordering', )

	def __unicode__(self):
		return self.name
