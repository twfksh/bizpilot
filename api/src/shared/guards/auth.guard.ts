import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(ctx: ExecutionContext) {
        const request = ctx.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const tokenPayload = await this.jwtService.verifyAsync(token);
            request.user = { id: tokenPayload.sub, email: tokenPayload.email };
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}