package com.kkukku.timing.apis.challenge.repositories;

import com.kkukku.timing.apis.challenge.entities.ChallengeEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<ChallengeEntity, Long> {

    List<ChallengeEntity> findByMemberId(Integer memberId);

    Optional<ChallengeEntity> findByIdAndMemberId(Long challengeId, Integer memberId);

    Optional<ChallengeEntity> findByParentId(Long feedId);

    Long countBy();
}
