export default {
  name: 'holdingPage',
  title: 'Holding Page',
  type: 'document',
  fields: [
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
    },
    {
      name: 'instagram',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Without the @ symbol',
    },
    {
      name: 'backgroundImages',
      title: 'Background Images Pool',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1).error('Add at least one background image'),
    },
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
}
