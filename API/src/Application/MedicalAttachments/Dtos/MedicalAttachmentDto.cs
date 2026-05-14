using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.MedicalAttachments.Queries
{
    public class MedicalAttachmentDto
    {
        public int Id { get; set; }
        // Foreign Key
        public int MedicalRecordId { get; set; }

        // Props
        public required string Name { get; set; }
        public required string Path { get; set; }
    }
}