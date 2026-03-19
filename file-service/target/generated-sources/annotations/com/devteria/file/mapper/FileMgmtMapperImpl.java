package com.devteria.file.mapper;

import com.devteria.file.dto.FileInfo;
import com.devteria.file.entity.FileMgmt;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Ubuntu)"
)
@Component
public class FileMgmtMapperImpl implements FileMgmtMapper {

    @Override
    public FileMgmt toFileMgmt(FileInfo fileInfo) {
        if ( fileInfo == null ) {
            return null;
        }

        FileMgmt.FileMgmtBuilder fileMgmt = FileMgmt.builder();

        fileMgmt.id( fileInfo.getName() );
        fileMgmt.contentType( fileInfo.getContentType() );
        fileMgmt.size( fileInfo.getSize() );
        fileMgmt.md5Checksum( fileInfo.getMd5Checksum() );
        fileMgmt.path( fileInfo.getPath() );

        return fileMgmt.build();
    }
}
