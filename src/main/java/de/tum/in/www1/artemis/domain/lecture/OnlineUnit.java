package de.tum.in.www1.artemis.domain.lecture;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonInclude;

@Entity
@DiscriminatorValue("O")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class OnlineUnit extends LectureUnit {

    @Column(name = "description")
    private String description;

    @Column(name = "source")
    private String source;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
